'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const mallSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  organizationId: z.string().min(1, 'Organization is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  timezone: z.string().optional().or(z.literal('')),
});

export async function getMalls() {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const malls = await prisma.mall.findMany({
      where: { deletedAt: null },
      include: {
        organization: {
          select: { name: true }
        },
        _count: {
          select: { restaurants: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: malls };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createMall(formData: FormData) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const data = {
      name: formData.get('name') as string,
      organizationId: formData.get('organizationId') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      timezone: formData.get('timezone') as string || 'Asia/Kolkata',
    };

    const validatedData = mallSchema.parse(data);

    // Generate slug
    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const mall = await prisma.mall.create({
      data: {
        ...validatedData,
        slug,
      }
    });

    revalidatePath('/dashboard/superadmin/malls');
    return { success: true, data: mall };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleMallStatus(id: string, isActive: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    await prisma.mall.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/dashboard/superadmin/malls');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
