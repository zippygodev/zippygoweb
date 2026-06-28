import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.email || data.phone, {
  message: 'Email or phone is required',
  path: ['email'],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: errors },
        { status: 400 }
      );
    }

    const { email, phone, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatarUrl: true,
        passwordHash: true,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account has been deactivated. Contact support.' },
        { status: 403 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        expiresAt,
        userAgent: request.headers.get('user-agent') ?? undefined,
        ipAddress: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash: _, ...userData } = user;

    return NextResponse.json({
      user: userData,
      token,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
