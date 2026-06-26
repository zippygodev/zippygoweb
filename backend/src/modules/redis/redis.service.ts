import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const host = process.env.REDIS_HOST || "localhost";
    const port = parseInt(process.env.REDIS_PORT || "6379", 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    try {
      const options: any = {
        maxRetriesPerRequest: 1, // retry once and fail so fallback is triggered immediately if offline
        connectTimeout: 5000,
      };

      if (redisUrl) {
        if (redisUrl.startsWith("rediss://") || redisUrl.includes("upstash.io")) {
          options.tls = { rejectUnauthorized: false };
        }
        this.client = new Redis(redisUrl, options);
        this.logger.log("Redis initialized using connection URL");
      } else {
        const isTls = process.env.REDIS_TLS === "true" || host.includes("upstash.io");
        if (isTls) {
          options.tls = { rejectUnauthorized: false };
        }
        this.client = new Redis({
          host,
          port,
          password,
          ...options,
        });
        this.logger.log(`Redis initialized at ${host}:${port} (TLS: ${isTls})`);
      }

      this.client.on("connect", () => {
        this.isConnected = true;
        this.logger.log("Redis connected successfully");
      });

      this.client.on("error", (err) => {
        this.isConnected = false;
        this.logger.error(`Redis error: ${err.message}`);
      });

      this.client.on("close", () => {
        this.isConnected = false;
        this.logger.warn("Redis connection closed");
      });
    } catch (error: any) {
      this.logger.error(`Failed to initialize Redis client: ${error.message}`);
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
      this.logger.log("Redis disconnected");
    }
  }

  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isReady()) return null;
    try {
      return await this.client!.get(key);
    } catch (err: any) {
      this.logger.error(`Redis GET error: ${err.message}`);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      if (ttlSeconds) {
        await this.client!.set(key, value, "EX", ttlSeconds);
      } else {
        await this.client!.set(key, value);
      }
      return true;
    } catch (err: any) {
      this.logger.error(`Redis SET error: ${err.message}`);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      await this.client!.del(key);
      return true;
    } catch (err: any) {
      this.logger.error(`Redis DEL error: ${err.message}`);
      return false;
    }
  }
}
