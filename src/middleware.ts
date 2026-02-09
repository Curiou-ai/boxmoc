
import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const protectedRoutes = ['/creator', '/admin'];
const authRoutes = ['/login', '/signup'];

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

// Initialize Redis and Ratelimit only if the environment variables are set
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
    analytics: true,
  });
} else {
  console.warn('Upstash Redis environment variables not set. Rate limiting will be disabled.');
}

export async function middleware(request: NextRequest) {
  // Only apply production middleware logic in production environment
  if (process.env.NODE_ENV === 'production') {
    // Rate Limiting Logic
    if (ratelimit) {
      const ip = request.ip ?? '127.0.0.1';
      const { success, pending, limit, remaining, reset } = await ratelimit.limit(ip);
      
      if (!success) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    }

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
