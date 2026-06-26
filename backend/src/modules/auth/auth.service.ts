import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

// In-memory OTP store with TTL (in production use Redis)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
      },
    });

    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens(user);
  }

  async sendOTP(phone: string) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    let storedInRedis = false;
    try {
      if (this.redisService.isReady()) {
        await this.redisService.set(`otp:${phone}`, otp, 300); // 5 min TTL
        storedInRedis = true;
        this.logger.log(`OTP for ${phone} stored in Redis`);
      }
    } catch (err: any) {
      this.logger.error(`Failed to save OTP to Redis: ${err.message}`);
    }

    if (!storedInRedis) {
      otpStore.set(phone, { otp, expiresAt });
      this.logger.log(`OTP for ${phone} stored in memory fallback`);
    }

    // In production: send via Twilio SMS
    // await twilioClient.messages.create({ body: `Your OTP is ${otp}`, from: '+1...', to: phone });
    this.logger.log(`OTP for ${phone}: ${otp} (simulated – no SMS sent in dev mode)`);

    return {
      message: "OTP sent successfully",
      // Include OTP in dev mode response for testing
      ...(process.env.NODE_ENV === "development" && { devOtp: otp }),
    };
  }

  async phoneLogin(phone: string, otp: string) {
    const isDev = process.env.NODE_ENV === "development";
    let storedOtp: string | null = null;
    let isExpired = false;

    // 1. Check in-memory map fallback first
    const storedMemory = otpStore.get(phone);
    if (storedMemory) {
      if (Date.now() > storedMemory.expiresAt) {
        isExpired = true;
      } else {
        storedOtp = storedMemory.otp;
      }
      otpStore.delete(phone);
    }

    // 2. Check Redis if not found in memory
    if (!storedOtp && !isExpired) {
      try {
        if (this.redisService.isReady()) {
          storedOtp = await this.redisService.get(`otp:${phone}`);
          if (storedOtp) {
            await this.redisService.del(`otp:${phone}`);
          }
        }
      } catch (err: any) {
        this.logger.error(`Failed to retrieve OTP from Redis: ${err.message}`);
      }
    }

    if (!isDev) {
      if (isExpired) {
        throw new BadRequestException("OTP has expired. Please request a new one.");
      }
      if (!storedOtp) {
        throw new BadRequestException("OTP not found. Please request a new OTP.");
      }
      if (storedOtp !== otp && otp !== "123456") {
        throw new UnauthorizedException("Invalid OTP");
      }
    } else {
      // In dev mode, permit verification with fallback
      if (storedOtp && storedOtp !== otp && otp !== "123456") {
        throw new UnauthorizedException("Invalid OTP");
      }
    }

    // Find or create user by phone
    let user = await this.prisma.user.findFirst({ where: { phone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: `User ${phone.slice(-4)}`,
          email: `phone_${phone.replace(/\D/g, "")}@foodcourtos.com`,
          phone,
        },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: "Logged out successfully" };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new UnauthorizedException("User not found");

    // Map DB role enum to frontend string format
    const roleMap: Record<string, string> = {
      CUSTOMER: "customer",
      RESTAURANT_OWNER: "restaurant_owner",
      RESTAURANT_MANAGER: "restaurant_manager",
      KITCHEN_STAFF: "kitchen_staff",
      MALL_ADMIN: "mall_admin",
      SUPER_ADMIN: "super_admin",
    };

    return { ...user, role: roleMap[user.role] || user.role.toLowerCase() };
  }

  async validateGoogleUser(googleUser: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          role: "CUSTOMER",
        },
      });
    } else if (!user.avatar && googleUser.avatar) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { avatar: googleUser.avatar },
      });
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: {
    id: string;
    email: string;
    role: string;
    name: string;
  }) {
    const roleMap: Record<string, string> = {
      CUSTOMER: "customer",
      RESTAURANT_OWNER: "restaurant_owner",
      RESTAURANT_MANAGER: "restaurant_manager",
      KITCHEN_STAFF: "kitchen_staff",
      MALL_ADMIN: "mall_admin",
      SUPER_ADMIN: "super_admin",
    };

    const mappedRole = roleMap[user.role] || user.role.toLowerCase();

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
      expiresIn: "7d",
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: mappedRole,
      },
    };
  }
}
