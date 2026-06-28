'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';

export async function getFeatureFlags() {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const flags = await prisma.featureFlag.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: flags };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleFeatureFlag(id: string, enabled: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    await prisma.featureFlag.update({
      where: { id },
      data: { enabled },
    });
    revalidatePath('/dashboard/superadmin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSystemSettings(formData: FormData) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    // A simple implementation that just acknowledges a successful save for demo purposes
    // since Settings are modeled as KV store.

    revalidatePath('/dashboard/superadmin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
