'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

// Helper to get the restaurant ID for the current owner
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

export async function getCategories() {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } }
      }
    });

    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    await prisma.category.create({
      data: {
        name,
        description,
        restaurantId,
      }
    });

    revalidatePath('/dashboard/restaurant/menu');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    await prisma.category.delete({
      where: { id, restaurantId }
    });

    revalidatePath('/dashboard/restaurant/menu');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProducts() {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const products = await prisma.product.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
      }
    });

    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const isVegetarian = formData.get('isVegetarian') === 'true';
    const isVegan = formData.get('isVegan') === 'true';
    const isGlutenFree = formData.get('isGlutenFree') === 'true';

    await prisma.product.create({
      data: {
        name,
        categoryId,
        price,
        description,
        isVegetarian,
        isVegan,
        isGlutenFree,
        restaurantId,
      }
    });

    revalidatePath('/dashboard/restaurant/menu');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    await prisma.product.update({
      where: { id, restaurantId },
      data: { isAvailable }
    });

    revalidatePath('/dashboard/restaurant/menu');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    const restaurantId = await getRestaurantId();
    if (!restaurantId) throw new Error('Restaurant not found');

    await prisma.product.delete({
      where: { id, restaurantId }
    });

    revalidatePath('/dashboard/restaurant/menu');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
