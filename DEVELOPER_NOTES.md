
# PROJECT
BOXMOC

# DEVELOPER
Admin

# STATUS
1. Security Posture ✅
2. Data Management Architecture ✅

# NOTES:

## Security Posture
*   **DDoS Protection & Rate Limiting**:
    *   Status: Active (Production-Ready)
    *   Implementation: The application uses a multi-tiered rate-limiting strategy via Upstash (Redis) in `src/middleware.ts`.
    *   **Global Limit**: 30 req / 10s.
    *   **Auth Limit**: 5 req / 1m.
    *   **Contact Limit**: 2 req / 1m.
    *   **Transaction Limit**: 3 req / 1m.
*   **CAPTCHA/Bot Protection**: Invisible reCAPTCHA for phone sign-ins.
*   **Email Verification**: Automated notifications via Resend/Nodemailer.

## Data Management Architecture (Firestore NoSQL)
Firestore is the primary database. Collections are schema-less but follow these application-enforced structures:

### 1. `waitlist` (Collection)
*   `email` (string): Unique identifier.
*   `status` (enum): 'waitlisted' | 'active' | 'redeemed'.
*   `code` (string | null): 8-char hex code for early access.
*   `createdAt` (timestamp).

### 2. `contact_submissions` (Collection)
*   `name`, `email`, `message`, `status` ('new', 'contacted', 'closed').
*   `notes` (array): Internal admin comments.

### 3. `users` (Collection)
*   `email` (string).
*   `displayName` (string).
*   `role` (enum): 'user' | 'admin'.
*   `stripeCustomerId` (string): For billing integration.
*   `stripeSubscriptionStatus` (string): active, trialing, etc.

#### 3a. `users/{uid}/assets` (Sub-collection)
*   `url` (string): Public Firebase Storage URL.
*   `name` (string): Filename.
*   `type` (string): MIME type.

#### 3b. `users/{uid}/orders` (Sub-collection)
*   `amountTotal` (number): Price in cents.
*   `designImageUrl` (string): URL of the design printed.
*   `shippingAddress` (object): Verified Stripe shipping data.
*   `status` (string): 'processing', 'shipped'.

## Package Dependencies
*   @upstash/ratelimit: ^2.0.4
*   firebase: ^11.1.0
*   firebase-admin: ^13.0.1
