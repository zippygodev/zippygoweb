'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function getMallRestaurants() {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    // In a real scenario, we should get the mallId assigned to this MALL_ADMIN.
    // For now, we'll just fetch all restaurants if SUPER_ADMIN or some fallback.
    // Let's assume we find the first mall for now if MALL_ADMIN.
    let mallId = undefined;
    if (session.user.role === 'MALL_ADMIN') {
      const mall = await prisma.mall.findFirst({
        where: { isActive: true }, // Simplified
      });
      mallId = mall?.id;
    }

    const restaurants = await prisma.restaurant.findMany({
      where: {
        deletedAt: null,
        ...(mallId ? { mallId } : {}),
      },
      include: {
        owner: {
          select: { name: true, email: true },
        },
        _count: {
          select: { orders: true, products: true },
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: restaurants };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleRestaurantStatus(id: string, isActive: boolean) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    await prisma.restaurant.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/dashboard/admin/restaurants');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRestaurant(formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const cuisineType = formData.get('cuisineType') as string;
    // ...other fields

    // Since we need an owner and a mall, this is a simplified creation.
    // Ideally, we'd also create the owner user or select an existing one.

    return { success: true, message: 'Restaurant created (mocked)' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
