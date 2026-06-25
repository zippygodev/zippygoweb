import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string, orderTotal: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) throw new Error("Invalid coupon");
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error("Coupon expired");
    if (orderTotal < coupon.minOrder) throw new Error(`Minimum order of $${coupon.minOrder} required`);
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new Error("Coupon usage limit reached");
    return coupon;
  }

  async apply(orderTotal: number, code: string) {
    const coupon = await this.validate(code, orderTotal);
    let discount = coupon.type === "percentage" ? (orderTotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    await this.prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    return { discount, code };
  }
}
