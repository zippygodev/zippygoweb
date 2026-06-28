import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/dashboard/restaurant',
  '/dashboard/delivery',
  '/dashboard/admin',
  '/dashboard/superadmin',
  '/customer/orders',
  '/customer/profile',
  '/customer/checkout',
];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  const nextauthToken = req.cookies.get('next-auth.session-token')?.value;
  const secureToken = req.cookies.get('__Secure-next-auth.session-token')?.value;
  const sessionToken = req.cookies.get('session_token')?.value;
  const hasToken = !!nextauthToken || !!secureToken || !!sessionToken;

  if (!hasToken) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customer/:path*',
  ],
};
