import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      const authHeader = request.headers.get('authorization');
      const headerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;

      if (!headerToken) {
        cookieStore.delete('session_token');
        cookieStore.delete('refresh_token');
        return NextResponse.json({ message: 'Logged out successfully' });
      }

      try {
        await prisma.session.delete({
          where: { token: headerToken },
        });
      } catch {
      }

      cookieStore.delete('session_token');
      cookieStore.delete('refresh_token');
      return NextResponse.json({ message: 'Logged out successfully' });
    }

    try {
      await prisma.session.delete({
        where: { token: sessionToken },
      });
    } catch {
    }

    cookieStore.delete('session_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
