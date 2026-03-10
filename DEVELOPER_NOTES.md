
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
    *   **Auth Limit**: 5 req / 1m (Protects login/signup).
    *   **Contact Limit**: 2 req / 1m.
    *   **Transaction Limit**: 3 req / 1m (Stripe protection).
*   **CAPTCHA/Bot Protection**: Firebase Phone Auth integration provides invisible reCAPTCHA.
*   **Email Verification**: Supported via Resend/Nodemailer.
*   **Password Strength**: Zod schema enforces complex passwords.
*   **Session Management**: Secure server-side session cookies (HttpOnly, Secure).

## Data Management Architecture (Firestore NoSQL)
*   **NoSQL First**: Firestore is the primary database. **Prisma/SQL is not used**.
*   **Waitlist Collection**:
    *   `email` (string): Unique identifier.
    *   `status` (enum): 'waitlisted' | 'active' | 'redeemed'.
    *   `code` (string | null): Unique 8-char hex code.
    *   `createdAt` (timestamp).
*   **Contact Submissions Collection**:
    *   `name`, `email`, `company`, `phone`, `message`, `source`, `createdAt`.
*   **Migrations**: Managed through application logic. No physical migration files are required for NoSQL.
*   **Validation**: Zod is the primary tool for enforcing data integrity at the edge.

## Package Dependencies
*   @upstash/ratelimit: ^2.0.4
*   @upstash/redis: ^1.34.3
*   firebase: ^11.1.0
*   firebase-admin: ^13.0.1
