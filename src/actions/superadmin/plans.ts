'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const planSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional().or(z.literal('')),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  organizationId: z.string().min(1, 'Organization is required'),
  maxMalls: z.coerce.number().min(1),
  maxRestaurants: z.coerce.number().min(1),
  maxUsers: z.coerce.number().min(1),
});

export async function getPlans() {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const plans = await prisma.plan.findMany({
      include: {
        organization: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: plans };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPlan(formData: FormData) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price'),
      organizationId: formData.get('organizationId') as string,
      maxMalls: formData.get('maxMalls'),
      maxRestaurants: formData.get('maxRestaurants'),
      maxUsers: formData.get('maxUsers'),
    };

    const validatedData = planSchema.parse(data);

    const plan = await prisma.plan.create({
      data: validatedData,
    });

    revalidatePath('/dashboard/superadmin/plans');
    return { success: true, data: plan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function togglePlanStatus(id: string, isActive: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    await prisma.plan.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/dashboard/superadmin/plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
