
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
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // --- Production-only Logic ---
  if (process.env.NODE_ENV === 'production') {
    // Rate Limiting
    if (ratelimit) {
      const ip = request.ip ?? '127.0.0.1';
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    }

    // Unauthenticated users trying to access login/signup are redirected to waitlist
    if (isAuthRoute && !sessionCookie) {
      return NextResponse.redirect(new URL('/waitlist', request.url));
    }
  }

  // --- Authentication Logic (all environments) ---

  // If user is logged in, redirect them from auth pages to the creator dashboard
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/creator', request.url));
  }

  // If user is not logged in, redirect them from protected pages to the login page
  // In production, this will trigger a second redirect to /waitlist
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
