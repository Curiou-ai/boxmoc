import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const protectedRoutes = ['/creator', '/admin'];
const authRoutes = ['/login', '/signup'];

let redis: Redis | null = null;
let globalRatelimit: Ratelimit | null = null;
let contactRatelimit: Ratelimit | null = null;
let authRatelimit: Ratelimit | null = null;
let transactionRatelimit: Ratelimit | null = null;

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (upstashUrl && upstashToken && !upstashUrl.includes('<') && !upstashToken.includes('<')) {
  try {
    redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });

    // Global limit: 30 requests per 10 seconds for general navigation
    globalRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(30, '10 s'),
      analytics: true,
      prefix: 'ratelimit_global',
    });

    // Stricter limit for contact submissions: 2 per minute to prevent spam
    contactRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(2, '1 m'),
      analytics: true,
      prefix: 'ratelimit_contact',
    });

    // Auth limit: 5 attempts per minute to mitigate brute-force
    authRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'ratelimit_auth',
    });

    // Transaction limit: 3 checkout sessions per minute to prevent abuse/card testing
    transactionRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(3, '1 m'),
      analytics: true,
      prefix: 'ratelimit_transaction',
    });
  } catch (error: any) {
    console.error('Failed to initialize Upstash Redis for rate limiting:', error.message);
    redis = null;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // --- DDoS Mitigation and Rate Limiting ---
  if (redis) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    // 1. Auth Protection (Login/Signup)
    if (pathname.includes('/api/auth/login') || pathname.includes('/api/auth/signup')) {
      if (authRatelimit) {
        const { success } = await authRatelimit.limit(`auth_${ip}`);
        if (!success) {
          return new NextResponse('Too many authentication attempts. Please try again later.', { status: 429 });
        }
      }
    }

    // 2. Contact Form Protection
    const isContactSubmission = 
      pathname === '/api/contact' || 
      (pathname === '/contact' && request.method === 'POST');

    if (isContactSubmission && contactRatelimit) {
      const { success } = await contactRatelimit.limit(`contact_${ip}`);
      if (!success) {
        return new NextResponse('Too many contact submissions. Please try again in a minute.', { status: 429 });
      }
    }

    // 3. Sensitive Transaction Protection (Stripe)
    if (pathname.includes('/api/stripe/create-checkout-session')) {
      if (transactionRatelimit) {
        const { success } = await transactionRatelimit.limit(`tx_${ip}`);
        if (!success) {
          return new NextResponse('Transaction rate limit exceeded. Please wait a moment.', { status: 429 });
        }
      }
    }

    // 4. Global Protection
    if (globalRatelimit) {
      const { success } = await globalRatelimit.limit(ip);
      if (!success) {
        return new NextResponse('Too Many Requests. Our servers are under heavy load.', { status: 429 });
      }
    }
  }

  // --- Authentication Logic ---
  if (process.env.NODE_ENV === 'production') {
    if (isAuthRoute && !sessionCookie) {
      return NextResponse.redirect(new URL('/waitlist', request.url));
    }
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/creator', request.url));
  }

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
