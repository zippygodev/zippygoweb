'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getAdminDashboardMetrics() {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized');
    }

    let mallId = undefined;
    if (session.user.role === 'MALL_ADMIN') {
      const mall = await prisma.mall.findFirst({ where: { isActive: true } });
      mallId = mall?.id;
    }

    const totalRestaurants = await prisma.restaurant.count({
      where: {
        ...(mallId ? { mallId } : {}),
      },
    });

    const activeOrders = await prisma.order.count({
      where: {
        ...(mallId ? { mallId } : {}),
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY']
        }
      }
    });

    const totalUsers = await prisma.user.count({
      where: {
        role: 'CUSTOMER'
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.findMany({
      where: {
        ...(mallId ? { mallId } : {}),
        createdAt: {
          gte: today
        },
        paymentStatus: 'COMPLETED'
      },
      select: {
        total: true
      }
    });

    const todaysRevenue = todayOrders.reduce((acc, order) => acc + Number(order.total), 0);

    const recentOrders = await prisma.order.findMany({
      where: {
        ...(mallId ? { mallId } : {}),
      },
      include: {
        restaurant: true,
        customer: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
    });

    const topRestaurants = await prisma.restaurant.findMany({
      where: {
        ...(mallId ? { mallId } : {}),
      },
      take: 5,
      orderBy: {
        orders: {
          _count: 'desc'
        }
      },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    return {
      success: true,
      data: {
        totalRestaurants,
        activeOrders,
        totalUsers,
        todaysRevenue,
        recentOrders: recentOrders.map(o => ({
          id: o.orderNumber,
          restaurant: o.restaurant.name,
          items: o.items.length,
          amount: Number(o.total),
          status: o.status,
          time: new Date(o.createdAt).toLocaleTimeString(),
          customer: o.customer.name || 'Unknown',
        })),
        topRestaurants: topRestaurants.map(r => ({
          name: r.name,
          orders: r._count.orders,
          revenue: 0, // Mock for now until aggregated properly
          rating: r.rating,
          image: r.name.substring(0, 2).toUpperCase()
        }))
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
