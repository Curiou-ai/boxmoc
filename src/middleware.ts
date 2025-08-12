
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/creator'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');

  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user is trying to access a protected route without a session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    const absoluteURL = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // If user is logged in and tries to access login/signup pages, redirect to creator dashboard
  if (authRoutes.some((route) => pathname.startsWith(route)) && sessionCookie) {
    const absoluteURL = new URL('/creator', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for API, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
