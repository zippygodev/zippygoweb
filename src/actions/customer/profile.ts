'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getMyAddresses() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized', data: [] };

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });

    return { success: true, data: addresses };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function addAddress(formData: {
  label: string;
  address: string;
  apartment?: string;
  landmark?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    // If new address is default, clear all other defaults
    if (formData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId: session.user.id,
        label: formData.label,
        address: formData.address,
        apartment: formData.apartment,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        isDefault: formData.isDefault ?? false,
      },
    });

    revalidatePath('/customer/profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAddress(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await prisma.address.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath('/customer/profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setDefaultAddress(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id, userId: session.user.id },
      data: { isDefault: true },
    });

    revalidatePath('/customer/profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
