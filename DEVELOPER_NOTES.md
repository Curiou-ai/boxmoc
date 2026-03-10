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
    *   **Global Limit**: Protects the site from general scraping and overwhelming traffic (30 req / 10s).
    *   **Auth Limit**: Specifically protects login/signup from brute-force and dictionary attacks (5 req / 1m).
    *   **Contact Limit**: Mitigates email spam and bot submissions via the contact form (2 req / 1m).
    *   **Transaction Limit**: Protects payment creation endpoints from card testing and session abuse (3 req / 1m).
    *   Location: /home/user/studio/src/middleware.ts
*   **CAPTCHA/Bot Protection**:
    *   Status: Active
    *   Implementation: Firebase Phone Authentication integration provides invisible reCAPTCHA for phone sign-ins.
    *   Location: /home/user/studio/src/components/phone-signin.tsx
*   **Email Verification & Notifications**:
    *   Status: Active & Supported
    *   Implementation: Automated welcome emails and security login notifications are sent via Resend/Nodemailer.
*   **Password Strength**:
    *   Status: Active
    *   Implementation: Zod schema enforces complex passwords (min 8 chars, uppercase, lowercase, number, special char).
    *   Location: /home/user/studio/src/app/api/auth/[...route]/route.ts
*   **Session Management**:
    *   Status: Active
    *   Implementation: Secure server-side session cookies (HttpOnly, Secure, SameSite: Lax).
*   **Input Validation**:
    *   Status: Active
    *   Implementation: Zod schemas validate all server action and API inputs.
*   **Environment Variables**:
    *   Status: Active
    *   Implementation: Strict separation between public and private keys in `.env`.

## Data Management Architecture
*   **ORM/Migrations**: Prisma is not used. Since Firestore is a NoSQL database, the application follows a schema-less approach.
*   **Data Evolution**: Any necessary data structural changes are managed through application-level logic or one-off migration scripts using the Firebase Admin SDK (`src/lib/firebase-admin.ts`).
*   **Validation**: Zod is the primary tool for enforcing data integrity at the edge (Server Actions and API routes).

## Package Dependencies
*   @upstash/ratelimit: ^2.0.4
*   @upstash/redis: ^1.34.3

# BREAKDOWN:
*   Granular rate limits added for Auth, Transactions, and Global traffic.
*   Updated Middleware to handle targeted DDoS mitigation.
*   Documented updated security posture and data management strategy in DEVELOPER_NOTES.md.
