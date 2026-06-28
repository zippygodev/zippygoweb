'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function toggleOnlineStatus(isOnline: boolean) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'DELIVERY_PARTNER' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    let deliveryPartnerId;

    if (session.user.role === 'DELIVERY_PARTNER') {
      const dp = await prisma.deliveryPartner.findUnique({
        where: { userId: session.user.id }
      });
      if (!dp) throw new Error('Delivery Partner not found');
      deliveryPartnerId = dp.id;
    } else {
      // Super admin fallback
      const dp = await prisma.deliveryPartner.findFirst();
      if (!dp) throw new Error('Delivery Partner not found');
      deliveryPartnerId = dp.id;
    }

    await prisma.deliveryPartner.update({
      where: { id: deliveryPartnerId },
      data: { isOnline }
    });

    revalidatePath('/dashboard/delivery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
