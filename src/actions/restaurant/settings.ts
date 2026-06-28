'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

async function getRestaurantId() {
  const session = await auth();
  if (!session || session.user?.role !== 'RESTAURANT_OWNER') {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }
  }

  if (session.user.role === 'RESTAURANT_OWNER') {
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: session.user.id }
    });
    return restaurant?.id;
  }
  
  // Super admin fallback (for testing)
  const firstRestaurant = await prisma.restaurant.findFirst();
  return firstRestaurant?.id;
}

export async function getRestaurantSettings() {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    return { success: true, data: restaurant };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRestaurantSettings(formData: FormData) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const data: any = {};
    const stringFields = ['name', 'phone', 'email', 'address', 'description', 'cuisineType', 'openingTime', 'closingTime'];
    const numberFields = ['preparationTime', 'deliveryTime', 'minOrderAmount', 'deliveryFee'];
    
    for (const field of stringFields) {
      const val = formData.get(field);
      if (val !== null) data[field] = val as string;
    }

    for (const field of numberFields) {
      const val = formData.get(field);
      if (val !== null) data[field] = Number(val);
    }

    // Handle boolean toggles if present
    const isActive = formData.get('isActive');
    if (isActive !== null) data.isActive = isActive === 'true';

    const isOpen = formData.get('isOpen');
    if (isOpen !== null) data.isOpen = isOpen === 'true';

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data
    });

    revalidatePath('/dashboard/restaurant/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
