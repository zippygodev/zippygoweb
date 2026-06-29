'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getMyFavorites() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized', data: { restaurants: [], products: [] } };

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            cuisineType: true,
            logoUrl: true,
            coverImageUrl: true,
            rating: true,
            deliveryTime: true,
            isOpen: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            restaurantId: true,
            restaurant: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const restaurants = favorites
      .filter((f) => f.restaurant)
      .map((f) => f.restaurant!);

    const products = favorites
      .filter((f) => f.product)
      .map((f) => ({ ...f.product!, favoriteId: f.id }));

    return { success: true, data: { restaurants, products } };
  } catch (error: any) {
    return { success: false, error: error.message, data: { restaurants: [], products: [] } };
  }
}

export async function toggleFavorite({
  restaurantId,
  productId,
}: {
  restaurantId?: string;
  productId?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        restaurantId: restaurantId ?? null,
        productId: productId ?? null,
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      revalidatePath('/customer/favorites');
      return { success: true, isFavorite: false };
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          restaurantId,
          productId,
        },
      });
      revalidatePath('/customer/favorites');
      return { success: true, isFavorite: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
