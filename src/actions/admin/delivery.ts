'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function getDeliveryPartners() {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    const partners = await prisma.deliveryPartner.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: partners };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleDeliveryPartnerStatus(id: string, isAvailable: boolean) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    await prisma.deliveryPartner.update({
      where: { id },
      data: { isAvailable },
    });
    revalidatePath('/dashboard/admin/delivery-partners');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDeliveryPartner(id: string) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    await prisma.deliveryPartner.delete({ where: { id } });
    revalidatePath('/dashboard/admin/delivery-partners');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
