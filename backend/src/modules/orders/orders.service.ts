import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    restaurantId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      variant?: string;
      addons?: any;
    }>;
    note?: string;
    tableNumber?: number;
    isTakeaway?: boolean;
  }) {
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = 49;
    const packagingFee = 19;
    const total = subtotal + deliveryFee + packagingFee;

    const lastOrder = await this.prisma.order.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const orderNumber = `ORD-${String(
      lastOrder ? parseInt(lastOrder.orderNumber.split("-")[1]) + 1 : 1,
    ).padStart(4, "0")}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        restaurantId: data.restaurantId,
        subtotal,
        deliveryFee,
        packagingFee,
        total,
        note: data.note,
        tableNumber: data.tableNumber,
        isTakeaway: data.isTakeaway || false,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.productId,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant,
            addons: item.addons,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
        restaurant: true,
      },
    });

    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        restaurant: { select: { name: true, logo: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByRestaurant(restaurantId: string, status?: string) {
    const where: any = { restaurantId };
    if (status) where.status = status;

    return this.prisma.order.findMany({
      where,
      include: {
        items: true,
        user: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
