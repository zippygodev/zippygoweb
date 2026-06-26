import { Injectable, Logger, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            cuisine: true,
            logo: true,
            coverImage: true,
            rating: true,
            deliveryTime: true,
            priceRange: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async toggle(userId: string, restaurantId: string) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    });

    if (existing) {
      // Remove favorite
      await this.prisma.favorite.delete({
        where: {
          userId_restaurantId: {
            userId,
            restaurantId,
          },
        },
      });
      return { favorited: false, message: "Removed from favorites" };
    } else {
      // Add favorite
      await this.prisma.favorite.create({
        data: {
          userId,
          restaurantId,
        },
      });
      return { favorited: true, message: "Added to favorites" };
    }
  }

  async isFavorited(userId: string, restaurantId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    });
    return { favorited: !!existing };
  }
}
