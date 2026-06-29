import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    const expiredSessions = await prisma.session.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    const deletedUsers = await prisma.user.deleteMany({
      where: {
        deletedAt: {
          not: null,
          lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({
      success: true,
      cleaned: {
        sessions: expiredSessions.count,
        users: deletedUsers.count,
      },
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}
