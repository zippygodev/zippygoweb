import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes that require authentication */
const PROTECTED_PATHS = [
  '/customer/orders',
  '/customer/profile',
  '/customer/checkout',
  '/customer/favorites',
  '/customer/reviews',
  '/customer/notifications',
  '/dashboard',
];

/** Role → allowed path prefixes */
const ROLE_ALLOWED_PATHS: Record<string, string[]> = {
  CUSTOMER:          ['/customer'],
  RESTAURANT_OWNER:  ['/dashboard/restaurant'],
  DELIVERY_PARTNER:  ['/dashboard/delivery'],
  MALL_ADMIN:        ['/dashboard/admin'],
  SUPER_ADMIN:       ['/dashboard/superadmin', '/dashboard/admin', '/dashboard/restaurant', '/dashboard/delivery'],
};

/** Role → redirect destination when they access a forbidden path */
const ROLE_HOME: Record<string, string> = {
  CUSTOMER:          '/customer',
  RESTAURANT_OWNER:  '/dashboard/restaurant',
  DELIVERY_PARTNER:  '/dashboard/delivery',
  MALL_ADMIN:        '/dashboard/admin',
  SUPER_ADMIN:       '/dashboard/superadmin',
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip public routes immediately
  const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Get session token via Edge-compatible getToken
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // Not logged in → redirect to login
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token.role as string) || 'CUSTOMER';
  const allowedPaths = ROLE_ALLOWED_PATHS[role] || [];
  const isAllowed = allowedPaths.some((allowed) => path.startsWith(allowed));

  if (!isAllowed) {
    // Logged in but wrong role → redirect to their actual dashboard
    const home = ROLE_HOME[role] || '/customer';
    return NextResponse.redirect(new URL(home, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customer/orders/:path*',
    '/customer/profile/:path*',
    '/customer/checkout/:path*',
    '/customer/favorites/:path*',
    '/customer/reviews/:path*',
    '/customer/notifications/:path*',
  ],
};
