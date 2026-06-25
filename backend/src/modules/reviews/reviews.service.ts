import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; restaurantId: string; rating: number; comment?: string }) {
    return this.prisma.review.create({ data });
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.review.findMany({
      where: { restaurantId, isActive: true },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
  }
}
