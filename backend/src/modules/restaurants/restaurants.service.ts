import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; cuisine?: string; isOpen?: boolean }) {
    const { page = 1, limit = 20, cuisine, isOpen } = params;
    const where: any = { deletedAt: null };
    if (cuisine) where.cuisine = cuisine;
    if (isOpen !== undefined) where.isOpen = isOpen;

    const [data, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { products: true, reviews: true } } },
        orderBy: { rating: "desc" },
      }),
      this.prisma.restaurant.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findBySlug(slug: string) {
    return this.prisma.restaurant.findUnique({
      where: { slug },
      include: {
        categories: { where: { isActive: true }, include: { products: { where: { isActive: true } } } },
        reviews: { take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, avatar: true } } } },
      },
    });
  }

  async create(data: any) {
    return this.prisma.restaurant.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.restaurant.update({ where: { id }, data });
  }
}
