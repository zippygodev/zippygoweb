import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  constructor(private prisma: PrismaService) {}

  async getRestaurantStats(restaurantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [
      todayOrders,
      yesterdayOrders,
      todayRevenue,
      yesterdayRevenue,
      avgRating,
      totalReviews,
      pendingOrders,
      recentOrders,
      popularProducts,
      totalCustomers,
    ] = await Promise.all([
      this.prisma.order.count({
        where: { restaurantId, createdAt: { gte: today } },
      }),
      this.prisma.order.count({
        where: { restaurantId, createdAt: { gte: yesterday, lt: today } },
      }),
      this.prisma.order.aggregate({
        where: { restaurantId, createdAt: { gte: today }, status: { notIn: ["CANCELLED"] } },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: { restaurantId, createdAt: { gte: yesterday, lt: today }, status: { notIn: ["CANCELLED"] } },
        _sum: { total: true },
      }),
      this.prisma.review.aggregate({ where: { restaurantId }, _avg: { rating: true } }),
      this.prisma.review.count({ where: { restaurantId } }),
      this.prisma.order.count({
        where: { restaurantId, status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } },
      }),
      this.prisma.order.findMany({
        where: { restaurantId },
        include: {
          user: { select: { name: true, phone: true } },
          items: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      this.prisma.orderItem.groupBy({
        by: ["productId"],
        where: { order: { restaurantId } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      this.prisma.order.groupBy({
        by: ["userId"],
        where: { restaurantId },
        _count: { id: true },
      }),
    ]);

    // Get product names for popular items
    const productIds = popularProducts.map((p) => p.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, image: true },
    });

    const popularWithNames = popularProducts.map((p) => ({
      ...p,
      product: products.find((prod) => prod.id === p.productId),
    }));

    const todayRev = todayRevenue._sum.total || 0;
    const yesterdayRev = yesterdayRevenue._sum.total || 0;
    const revenueChange = yesterdayRev > 0
      ? (((todayRev - yesterdayRev) / yesterdayRev) * 100).toFixed(1)
      : "0";

    const orderChange = yesterdayOrders > 0
      ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(1)
      : "0";

    return {
      todayRevenue: todayRev,
      yesterdayRevenue: yesterdayRev,
      revenueChange: parseFloat(revenueChange),
      todayOrders,
      yesterdayOrders,
      orderChange: parseFloat(orderChange),
      avgRating: parseFloat((avgRating._avg.rating || 0).toFixed(1)),
      totalReviews,
      pendingOrders,
      totalCustomers: totalCustomers.length,
      recentOrders,
      popularProducts: popularWithNames,
    };
  }

  async getRestaurantRevenue(restaurantId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: { gte: since },
        status: { notIn: ["CANCELLED"] },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by date
    const byDate: Record<string, number> = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      byDate[date] = (byDate[date] || 0) + order.total;
    });

    return Object.entries(byDate).map(([date, revenue]) => ({ date, revenue }));
  }

  async getMallStats(organizationId: string) {
    const restaurants = await this.prisma.restaurant.findMany({
      where: { organizationId },
    });
    const restaurantIds = restaurants.map((r) => r.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      activeUsers,
      pendingOrders,
      recentOrders,
      orderGroups,
    ] = await Promise.all([
      this.prisma.order.count({ where: { restaurantId: { in: restaurantIds } } }),
      this.prisma.order.count({
        where: { restaurantId: { in: restaurantIds }, createdAt: { gte: today } },
      }),
      this.prisma.order.aggregate({
        where: { restaurantId: { in: restaurantIds }, status: { notIn: ["CANCELLED"] } },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: { restaurantId: { in: restaurantIds }, createdAt: { gte: today }, status: { notIn: ["CANCELLED"] } },
        _sum: { total: true },
      }),
      this.prisma.user.count({ where: { role: "CUSTOMER", isActive: true } }),
      this.prisma.order.count({
        where: { restaurantId: { in: restaurantIds }, status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } },
      }),
      this.prisma.order.findMany({
        where: { restaurantId: { in: restaurantIds } },
        include: {
          restaurant: { select: { name: true } },
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      this.prisma.order.groupBy({
        by: ["restaurantId"],
        where: {
          restaurantId: { in: restaurantIds },
          status: { notIn: ["CANCELLED"] },
        },
        _count: { id: true },
        _sum: { total: true },
      }),
    ]);

    const topRestaurants = orderGroups
      .map((group) => {
        const rest = restaurants.find((r) => r.id === group.restaurantId);
        return {
          name: rest?.name || "Unknown",
          orders: group._count.id,
          revenue: group._sum.total || 0,
          rating: rest?.rating || 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get 14 days revenue overview
    const since = new Date();
    since.setDate(since.getDate() - 14);
    const ordersSince = await this.prisma.order.findMany({
      where: {
        restaurantId: { in: restaurantIds },
        createdAt: { gte: since },
        status: { notIn: ["CANCELLED"] },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const byDate: Record<string, number> = {};
    ordersSince.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      byDate[date] = (byDate[date] || 0) + order.total;
    });

    const revenueOverview = Object.entries(byDate).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    return {
      totalRestaurants: restaurants.length,
      activeRestaurants: restaurants.filter((r) => r.isActive).length,
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      todayRevenue: todayRevenue._sum.total || 0,
      activeUsers,
      pendingOrders,
      recentOrders,
      topRestaurants,
      revenueOverview,
    };
  }

  async getSuperAdminStats() {
    const [
      totalOrganizations,
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.restaurant.count({ where: { isActive: true } }),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: { notIn: ["CANCELLED"] } },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrganizations,
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  }
}
