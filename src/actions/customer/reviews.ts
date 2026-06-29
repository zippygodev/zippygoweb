'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getMyReviews() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized', data: [] };

    const reviews = await prisma.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { name: true, logoUrl: true, slug: true } },
        product: { select: { name: true, imageUrl: true } },
      },
    });

    return { success: true, data: reviews };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function submitReview({
  restaurantId,
  productId,
  rating,
  comment,
}: {
  restaurantId: string;
  productId?: string;
  rating: number;
  comment?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await prisma.review.upsert({
      where: {
        userId_restaurantId_productId: {
          userId: session.user.id,
          restaurantId,
          productId: productId ?? '',
        },
      },
      create: {
        userId: session.user.id,
        restaurantId,
        productId,
        rating,
        comment,
        images: [],
      },
      update: { rating, comment },
    });

    // Update restaurant rating
    const stats = await prisma.review.aggregate({
      where: { restaurantId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        rating: stats._avg.rating ?? 0,
        totalReviews: stats._count.rating,
      },
    });

    revalidatePath('/customer/reviews');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
