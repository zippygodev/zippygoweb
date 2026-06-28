'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const organizationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export async function getOrganizations() {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const orgs = await prisma.organization.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: { malls: true, plans: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: orgs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createOrganization(formData: FormData) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      website: formData.get('website') as string,
    };

    const validatedData = organizationSchema.parse(data);

    // generate a simple slug
    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const org = await prisma.organization.create({
      data: {
        ...validatedData,
        slug,
      }
    });

    revalidatePath('/dashboard/superadmin/organizations');
    return { success: true, data: org };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleOrganizationStatus(id: string, isActive: boolean) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'SUPER_ADMIN') throw new Error('Unauthorized');

    await prisma.organization.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/dashboard/superadmin/organizations');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
