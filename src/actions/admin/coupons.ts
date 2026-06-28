'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function getCoupons() {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    let mallId = undefined;
    if (session.user.role === 'MALL_ADMIN') {
      const mall = await prisma.mall.findFirst({ where: { isActive: true } });
      mallId = mall?.id;
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: coupons };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/dashboard/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCoupon(formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    const code = formData.get('code') as string;
    const type = formData.get('type') as any;
    const value = parseFloat(formData.get('value') as string);
    const minOrderValue = formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue') as string) : null;
    const maxDiscount = formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount') as string) : null;
    const validUntil = formData.get('validUntil') ? new Date(formData.get('validUntil') as string) : null;
    const usageLimit = formData.get('usageLimit') ? parseInt(formData.get('usageLimit') as string, 10) : null;

    // mallId is not in Coupon model

    await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType: type,
        discountValue: value,
        minOrderAmount: minOrderValue || 0,
        maxDiscount,
        startsAt: new Date(),
        endsAt: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit,
        isActive: true,
      }
    });

    revalidatePath('/dashboard/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(id: string) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    await prisma.coupon.delete({ where: { id } });
    revalidatePath('/dashboard/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
