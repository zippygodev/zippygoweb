'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getMyNotifications() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized', data: [] };

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
      take: 50,
    });

    return { success: true, data: notifications };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function markNotificationRead(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await prisma.notification.update({
      where: { id, userId: session.user.id },
      data: { isRead: true, readAt: new Date() },
    });

    revalidatePath('/customer/notifications');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsRead() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    revalidatePath('/customer/notifications');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
