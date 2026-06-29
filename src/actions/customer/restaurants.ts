'use server';

import { prisma } from '@/lib/prisma';

export async function getActiveRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        cuisineType: true,
        logoUrl: true,
        coverImageUrl: true,
        bannerUrl: true,
        rating: true,
        totalReviews: true,
        deliveryTime: true,
        preparationTime: true,
        minOrderAmount: true,
        deliveryFee: true,
        isOpen: true,
        address: true,
        openingTime: true,
        closingTime: true,
        _count: { select: { products: true } },
      },
    });
    return { success: true, data: restaurants };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function getRestaurantBySlug(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug, isActive: true, deletedAt: null },
      include: {
        categories: {
          where: { isActive: true, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          include: {
            products: {
              where: { isAvailable: true, deletedAt: null },
              orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
              include: {
                variants: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { name: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!restaurant) return { success: false, error: 'Restaurant not found', data: null };
    return { success: true, data: restaurant };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        isFeatured: true,
        deletedAt: null,
        restaurant: { isActive: true, isOpen: true },
      },
      take: 10,
      orderBy: { rating: 'desc' },
      include: {
        restaurant: {
          select: { name: true, slug: true, logoUrl: true },
        },
        variants: { take: 1, orderBy: { sortOrder: 'asc' } },
      },
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}
