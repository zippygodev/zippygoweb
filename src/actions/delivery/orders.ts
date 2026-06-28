'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

async function getDeliveryPartnerId() {
  const session = await auth();
  if (!session || (session.user?.role !== 'DELIVERY_PARTNER' && session.user?.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized');
  }

  if (session.user.role === 'DELIVERY_PARTNER') {
    const dp = await prisma.deliveryPartner.findUnique({
      where: { userId: session.user.id }
    });
    return dp?.id;
  }
  
  // Super admin fallback (for testing)
  const dp = await prisma.deliveryPartner.findFirst();
  return dp?.id;
}

export async function getAvailableOrders() {
  try {
    const deliveryPartnerId = await getDeliveryPartnerId();
    if (!deliveryPartnerId) throw new Error('Delivery Partner not found');

    const orders = await prisma.order.findMany({
      where: {
        status: 'READY',
        deliveryType: 'ROBOT',
        deliveryPartnerId: null, // Unassigned
      },
      include: {
        restaurant: true,
        customer: true,
      }
    });

    return { success: true, data: orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMyActiveOrders() {
  try {
    const deliveryPartnerId = await getDeliveryPartnerId();
    if (!deliveryPartnerId) throw new Error('Delivery Partner not found');

    const orders = await prisma.order.findMany({
      where: {
        deliveryPartnerId,
        status: {
          in: ['OUT_FOR_DELIVERY']
        }
      },
      include: {
        restaurant: true,
        customer: true,
      }
    });

    return { success: true, data: orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function acceptOrder(orderId: string) {
  try {
    const deliveryPartnerId = await getDeliveryPartnerId();
    if (!deliveryPartnerId) throw new Error('Delivery Partner not found');

    // Make sure order is still available
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        status: 'READY',
        deliveryPartnerId: null,
      }
    });

    if (!order) {
      throw new Error('Order is no longer available');
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryPartnerId,
        status: 'OUT_FOR_DELIVERY',
      }
    });

    revalidatePath('/dashboard/delivery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDeliveryStatus(orderId: string, status: string) {
  try {
    const deliveryPartnerId = await getDeliveryPartnerId();
    if (!deliveryPartnerId) throw new Error('Delivery Partner not found');

    // Make sure order belongs to this delivery partner
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        deliveryPartnerId,
      }
    });

    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any,
      }
    });

    revalidatePath('/dashboard/delivery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
