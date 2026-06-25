import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    const [restaurants, products] = await Promise.all([
      this.prisma.restaurant.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { cuisine: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
          isActive: true,
          deletedAt: null,
        },
        take: 10,
      }),
      this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
          isActive: true,
          deletedAt: null,
        },
        include: { restaurant: { select: { name: true, slug: true } } },
        take: 10,
      }),
    ]);

    return { restaurants, products };
  }

  async getTrending() {
    // Simplified trending - could be enhanced with real analytics
    const popularProducts = await this.prisma.product.findMany({
      where: { isPopular: true, isActive: true },
      take: 10,
      include: { restaurant: { select: { name: true } } },
    });

    return popularProducts.map((p) => p.name);
  }
}
