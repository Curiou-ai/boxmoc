
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
*   **CAPTCHA/Bot Protection**:
    *   Status: Active
    *   Implementation: Firebase Phone Authentication integration provides invisible reCAPTCHA for phone sign-ins.
*   **Email Verification & Notifications**:
    *   Status: Active & Supported
    *   Implementation: Automated welcome emails and security login notifications are sent via Resend/Nodemailer.
*   **Password Strength**:
    *   Status: Active
    *   Implementation: Zod schema enforces complex passwords (min 8 chars, uppercase, lowercase, number, special char).
*   **Session Management**:
    *   Status: Active
    *   Implementation: Secure server-side session cookies (HttpOnly, Secure, SameSite: Lax).
*   **Input Validation**:
    *   Status: Active
    *   Implementation: Zod schemas validate all server action and API inputs.

## Data Management Architecture (Firestore NoSQL)
*   **NoSQL First**: Firestore is the primary database. Collections are created automatically on first write.
*   **Waitlist Collection** (`waitlist`):
    *   `email` (string): Unique identifier.
    *   `status` (enum): 'waitlisted' | 'active' | 'redeemed'.
    *   `code` (string | null): Unique 8-char hex code for early access.
    *   `createdAt` (timestamp): Server-side timestamp.
    *   `source` (string): 'web_form' | 'api'.
*   **Contact Submissions Collection** (`contact_submissions`):
    *   `name` (string): Sender name.
    *   `email` (string): Sender contact.
    *   `company` (string): Optional.
    *   `phone` (string): Optional.
    *   `message` (string): Concatenated from prompt/notes.
    *   `source` (string): 'web_form' | 'api' | 'chatbot'.
    *   `status` (enum): 'new' | 'contacted' | 'closed'.
    *   `createdAt` (timestamp): Server-side timestamp.
*   **User Assets Collection** (`users/{uid}/assets`):
    *   `url` (string): Firebase Storage public URL.
    *   `name` (string): Original filename.
    *   `type` (string): MIME type.
    *   `size` (number): Bytes.
    *   `createdAt` (timestamp): Server-side timestamp.

## Package Dependencies
*   @upstash/ratelimit: ^2.0.4
*   @upstash/redis: ^1.34.3
*   firebase: ^11.1.0
*   firebase-admin: ^13.0.1
