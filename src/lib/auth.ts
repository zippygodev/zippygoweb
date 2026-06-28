import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.email || data.phone, {
  message: 'Email or phone is required',
  path: ['email'],
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, phone, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              ...(email ? [{ email }] : []),
              ...(phone ? [{ phone }] : []),
            ],
            deletedAt: null,
          },
        });

        if (!user || !user.passwordHash || !user.isActive) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as any;
        token.name = user.name as string;
        token.email = user.email as string;
        token.picture = user.image as string;
      }
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.role) token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as any;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.picture as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
});
