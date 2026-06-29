'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { generateOrderNumber } from '@/lib/utils';

export async function getMyOrders() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized', data: [] };

    const orders = await prisma.order.findMany({
      where: { customerId: session.user.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { name: true, logoUrl: true, slug: true } },
        items: {
          include: {
            product: { select: { name: true, imageUrl: true } },
            variant: { select: { name: true } },
          },
        },
      },
    });

    return { success: true, data: orders };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function getOrderById(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized', data: null };

    const order = await prisma.order.findFirst({
      where: { id, customerId: session.user.id, deletedAt: null },
      include: {
        restaurant: {
          select: { name: true, logoUrl: true, slug: true, phone: true, address: true },
        },
        items: {
          include: {
            product: { select: { name: true, imageUrl: true } },
            variant: { select: { name: true } },
          },
        },
        payment: true,
      },
    });

    if (!order) return { success: false, error: 'Order not found', data: null };
    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

interface PlaceOrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  variantName?: string;
  specialInstructions?: string;
}

interface PlaceOrderData {
  restaurantId: string;
  deliveryType: 'PICKUP' | 'TABLE' | 'ROBOT';
  tableNumber?: string;
  notes?: string;
  couponCode?: string;
  paymentMethod: 'RAZORPAY' | 'COD';
  items: PlaceOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export async function placeOrder(data: PlaceOrderData) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    // Validate restaurant exists and is active
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: data.restaurantId, deletedAt: null },
      select: { id: true, isActive: true, isOpen: true },
    });
    if (!restaurant) return { success: false, error: 'Restaurant not found' };
    if (!restaurant.isActive) return { success: false, error: 'Restaurant is not active' };

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: session.user.id,
        restaurantId: data.restaurantId,
        deliveryType: data.deliveryType,
        paymentMethod: data.paymentMethod,
        tableNumber: data.tableNumber,
        notes: data.notes,
        couponCode: data.couponCode,
        subtotal: data.subtotal,
        gst: data.tax,
        deliveryFee: data.deliveryFee,
        discount: data.discount,
        total: data.total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            specialInstructions: item.specialInstructions,
          })),
        },
      },
    });

    // Create a notification for the customer
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: 'Order Placed',
        message: `Your order #${orderNumber} has been placed successfully.`,
        type: 'ORDER_UPDATE',
      },
    });

    revalidatePath('/customer/orders');
    return { success: true, data: { id: order.id, orderNumber: order.orderNumber } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
