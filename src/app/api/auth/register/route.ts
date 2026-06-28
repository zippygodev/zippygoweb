import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  name: z.string().min(1, 'Name is required').max(100),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: errors },
        { status: 400 }
      );
    }

    const { email, password, name, phone, role } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    if (phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone, deletedAt: null },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: 'A user with this phone number already exists' },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role,
      },
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
        createdAt: true,
      },
    });

    return NextResponse.json(
      { user, message: 'Account created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
