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

## Data Management Architecture (Firestore NoSQL)
*   **NoSQL First**: Firestore is the primary database.
*   **Waitlist Collection**:
    *   `email` (string): Unique identifier.
    *   `status` (enum): 'waitlisted' | 'active' | 'redeemed'.
    *   `code` (string | null): Unique 8-char hex code for early access.
    *   `createdAt` (timestamp): Server-side timestamp.
*   **Contact Submissions Collection**:
    *   `name` (string): Sender name.
    *   `email` (string): Sender contact.
    *   `company` (string): Optional.
    *   `phone` (string): Optional.
    *   `message` (string): Concatenated from prompt/notes.
    *   `source` (string): 'web_form' | 'api' | 'chatbot'.
    *   `createdAt` (timestamp): Server-side timestamp.
*   **Migrations**: Managed through application logic and Zod validation. Structural changes are handled by merging new fields during writes or via administrative scripts.
*   **Validation**: Zod is the primary tool for enforcing data integrity at the edge (Server Actions and API routes).

## Package Dependencies
*   @upstash/ratelimit: ^2.0.4
*   @upstash/redis: ^1.34.3

# BREAKDOWN:
*   Granular rate limits added for Auth, Transactions, and Global traffic.
*   Updated Middleware to handle targeted DDoS mitigation.
*   Added dedicated Waitlist API endpoint (`/api/waitlist`).
*   Established formal NoSQL "schema" definitions for waitlist and contact collections.
*   Documented updated security posture and data management strategy in DEVELOPER_NOTES.md.
