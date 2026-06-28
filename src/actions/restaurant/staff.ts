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

export async function getStaff() {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const staffMembers = await prisma.restaurantStaff.findMany({
      where: { restaurantId },
      include: {
        user: true,
      },
    });

    return { success: true, data: staffMembers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addStaff(formData: FormData) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create user if not exists
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: 'CUSTOMER', // base role, staff role handled by RestaurantStaff model
        }
      });
    }

    // Assign to restaurant
    await prisma.restaurantStaff.create({
      data: {
        restaurantId,
        userId: user.id,
        role: role || 'STAFF',
      }
    });

    revalidatePath('/dashboard/restaurant/staff');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeStaff(id: string) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    await prisma.restaurantStaff.delete({
      where: { id, restaurantId }
    });

    revalidatePath('/dashboard/restaurant/staff');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleStaffStatus(id: string, isActive: boolean) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    await prisma.restaurantStaff.update({
      where: { id, restaurantId },
      data: { isActive }
    });

    revalidatePath('/dashboard/restaurant/staff');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
