import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as crypto from "crypto";
import Razorpay from "razorpay";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: Razorpay | null = null;

  constructor(private prisma: PrismaService) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && !keyId.startsWith("your-")) {
      this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      this.logger.log("Razorpay initialized in live mode");
    } else {
      this.logger.warn("Razorpay keys not configured – running in simulation mode");
    }
  }

  async createOrder(orderId: string, amount: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException("Order not found");

    // Simulate Razorpay order in dev mode
    if (!this.razorpay) {
      const simulated = await this.prisma.payment.create({
        data: {
          orderId,
          amount,
          currency: "INR",
          status: "PENDING",
          method: "simulated",
          provider: "razorpay_sim",
          transactionId: `sim_${Date.now()}`,
          paymentIntentId: `rzp_sim_order_${Date.now()}`,
        },
      });

      return {
        razorpayOrderId: simulated.paymentIntentId,
        amount: amount * 100,
        currency: "INR",
        key: "rzp_test_simulated",
        simulated: true,
        paymentId: simulated.id,
      };
    }

    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency: "INR",
      receipt: orderId,
    });

    await this.prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        amount,
        currency: "INR",
        status: "PENDING",
        provider: "razorpay",
        paymentIntentId: razorpayOrder.id as string,
      },
      update: {
        paymentIntentId: razorpayOrder.id as string,
        status: "PENDING",
      },
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }) {
    // For simulated orders, auto-verify
    if (data.razorpayOrderId.startsWith("rzp_sim_order_")) {
      const payment = await this.prisma.payment.update({
        where: { orderId: data.orderId },
        data: {
          status: "PAID",
          transactionId: data.razorpayPaymentId || `sim_pay_${Date.now()}`,
        },
      });
      await this.prisma.order.update({
        where: { id: data.orderId },
        data: { status: "CONFIRMED" },
      });
      return { success: true, payment, simulated: true };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const body = `${data.razorpayOrderId}|${data.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== data.razorpaySignature) {
      throw new BadRequestException("Invalid payment signature");
    }

    const payment = await this.prisma.payment.update({
      where: { orderId: data.orderId },
      data: {
        status: "PAID",
        transactionId: data.razorpayPaymentId,
      },
    });

    // Auto-confirm the order
    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: "CONFIRMED" },
    });

    return { success: true, payment };
  }

  async handleWebhook(payload: any, signature: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (expectedSig !== signature) {
      throw new BadRequestException("Invalid webhook signature");
    }

    const event = payload.event;
    this.logger.log(`Razorpay webhook: ${event}`);

    if (event === "payment.captured") {
      const paymentId = payload.payload?.payment?.entity?.id;
      const orderId = payload.payload?.payment?.entity?.receipt;

      if (orderId && paymentId) {
        await this.prisma.payment.update({
          where: { orderId },
          data: { status: "PAID", transactionId: paymentId },
        });
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: "CONFIRMED" },
        });
      }
    }

    if (event === "payment.failed") {
      const orderId = payload.payload?.payment?.entity?.receipt;
      if (orderId) {
        await this.prisma.payment.update({
          where: { orderId },
          data: { status: "FAILED" },
        });
      }
    }

    return { received: true };
  }

  async create(data: { orderId: string; amount: number; method: string; provider: string }) {
    return this.prisma.payment.create({ data: { ...data, status: "PAID" } });
  }

  async findByOrder(orderId: string) {
    return this.prisma.payment.findUnique({ where: { orderId } });
  }

  async refund(orderId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException("Payment not found");

    if (this.razorpay && payment.transactionId) {
      try {
        await this.razorpay.payments.refund(payment.transactionId, {
          amount: Math.round(payment.amount * 100),
        });
      } catch (err) {
        this.logger.error("Razorpay refund failed", err);
      }
    }

    return this.prisma.payment.update({ where: { orderId }, data: { status: "REFUNDED" } });
  }

  async getHistory(userId: string) {
    return this.prisma.payment.findMany({
      where: { order: { userId } },
      include: { order: { select: { orderNumber: true, total: true, status: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}
