'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function getTables() {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    // In a real scenario, we find the mall id from the MALL_ADMIN profile.
    let mallId = undefined;
    if (session.user.role === 'MALL_ADMIN') {
      const mall = await prisma.mall.findFirst({ where: { isActive: true } });
      mallId = mall?.id;
    }

    const tables = await prisma.table.findMany({
      where: {
        ...(mallId ? { mallId } : {}),
      },
      orderBy: { tableNumber: 'asc' }
    });

    return { success: true, data: tables };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTable(formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    const number = formData.get('number') as string;
    const seats = parseInt(formData.get('seats') as string, 10);
    const location = formData.get('location') as string;

    let mallId = formData.get('mallId') as string;
    if (!mallId && session.user.role === 'MALL_ADMIN') {
      const mall = await prisma.mall.findFirst({ where: { isActive: true } });
      mallId = mall?.id as string;
    }

    await prisma.table.create({
      data: {
        tableNumber: number,
        capacity: seats,
        qrCode: `TABLE-${number}-${Date.now()}`,
        status: 'AVAILABLE',
        mallId,
      }
    });

    revalidatePath('/dashboard/admin/tables');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTable(id: string) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    await prisma.table.delete({ where: { id } });
    revalidatePath('/dashboard/admin/tables');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
