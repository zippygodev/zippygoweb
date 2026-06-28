'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

async function getRestaurantId() {
  const session = await auth();
  if (!session || session.user?.role !== 'RESTAURANT_OWNER') {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }
  }

  if (session.user.role === 'RESTAURANT_OWNER') {
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: session.user.id }
    });
    return restaurant?.id;
  }
  
  // Super admin fallback (for testing)
  const firstRestaurant = await prisma.restaurant.findFirst();
  return firstRestaurant?.id;
}

export async function getLiveOrders() {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        status: {
          notIn: ['COMPLETED', 'CANCELLED']
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        items: true,
      }
    });

    return { success: true, data: orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    // Make sure the order actually belongs to this restaurant
    const order = await prisma.order.findFirst({
      where: { id: orderId, restaurantId }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as any }
    });

    revalidatePath('/dashboard/restaurant/orders');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
