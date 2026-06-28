'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function getUsers() {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(id: string, role: UserRole) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    await prisma.user.update({
      where: { id },
      data: { role },
    });
    revalidatePath('/dashboard/superadmin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    await prisma.user.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/dashboard/superadmin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
