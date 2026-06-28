import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get('session_token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            avatarUrl: true,
            isActive: true,
            emailVerified: true,
            phoneVerified: true,
            lastLoginAt: true,
            createdAt: true,
            restaurant: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                isActive: true,
                isOpen: true,
                mall: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            deliveryPartner: {
              select: {
                id: true,
                isOnline: true,
                isAvailable: true,
                vehicleType: true,
                vehicleNumber: true,
                isVerified: true,
                totalDeliveries: true,
                totalEarnings: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      return NextResponse.json(
        { error: 'Session expired. Please log in again.' },
        { status: 401 }
      );
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
