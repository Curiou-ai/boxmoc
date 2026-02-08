
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/creator', '/admin'];
const authRoutes = ['/login', '/signup'];

// In-memory store for rate limiting
const ipRequestCounts = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 10;

export function middleware(request: NextRequest) {
  // Only apply middleware logic in production environment
  if (process.env.NODE_ENV === 'production') {
    // Rate Limiting Logic
    const ip = request.ip ?? '127.0.0.1';
    const now = Date.now();

    const timestamps = ipRequestCounts.get(ip) ?? [];
    const recentTimestamps = timestamps.filter((ts) => ts > now - RATE_LIMIT_WINDOW);
    
    if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    ipRequestCounts.set(ip, [...recentTimestamps, now]);

    // Authentication Logic
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
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
