import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const protectedRoutes = ['/creator', '/admin'];
const authRoutes = ['/login', '/signup'];

let redis: Redis | null = null;
let globalRatelimit: Ratelimit | null = null;
let contactRatelimit: Ratelimit | null = null;

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis and Ratelimit only if the environment variables are set and not placeholders
if (upstashUrl && upstashToken && !upstashUrl.includes('<') && !upstashToken.includes('<')) {
  try {
    redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });

    // Global limit: 10 requests per 10 seconds
    globalRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: 'ratelimit_global',
    });

    // Stricter limit for contact submissions: 2 per minute
    contactRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(2, '1 m'),
      analytics: true,
      prefix: 'ratelimit_contact',
    });
  } catch (error: any) {
    console.error('Failed to initialize Upstash Redis for rate limiting:', error.message);
    redis = null;
    globalRatelimit = null;
    contactRatelimit = null;
  }
} else {
  // Silent in production if not configured, or subtle log in dev
  if (process.env.NODE_ENV !== 'production') {
    console.log('Upstash Redis not configured. Rate limiting is disabled.');
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // --- Production-only Logic ---
  if (process.env.NODE_ENV === 'production') {
    // Rate Limiting
    if (redis) {
      const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
      
      // 1. Specific Rate Limit for Contact Submissions
      const isContactSubmission = 
        pathname === '/api/contact' || 
        (pathname === '/contact' && request.method === 'POST');

      if (isContactSubmission && contactRatelimit) {
        const { success } = await contactRatelimit.limit(`contact_${ip}`);
        if (!success) {
          return new NextResponse('Too many contact submissions. Please try again in a minute.', { status: 429 });
        }
      }

      // 2. Global Rate Limit
      if (globalRatelimit) {
        const { success } = await globalRatelimit.limit(ip);
        if (!success) {
          return new NextResponse('Too Many Requests', { status: 429 });
        }
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
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};