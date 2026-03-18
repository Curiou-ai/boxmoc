
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
    *   **Global Limit**: 30 req / 10s.
    *   **Auth Limit**: 5 req / 1m.
    *   **Contact Limit**: 2 req / 1m.
    *   **Transaction Limit**: 3 req / 1m.
*   **CAPTCHA/Bot Protection**: Invisible reCAPTCHA for phone sign-ins.
*   **Email Verification**: Automated notifications via Resend/Nodemailer.
*   **Environment Variables**:
    *   Status: Active
    *   Implementation: Strict separation between public and private keys in `.env`.

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
*   **Users Collection** (`transactions`):
    *   `email` (string).
    *   `displayName` (string).
    *   `role` (enum): 'user' | 'admin'.
    *   `stripeCustomerId` (string): For billing integration.
    *   `stripeSubscriptionStatus` (string): active, trialing, etc.
*   **User Assets Collection** (Sub-collection) (`users/{uid}/assets`):
    *   `url` (string): Firebase Storage public URL.
    *   `name` (string): Original filename.
    *   `type` (string): MIME type.
    *   `size` (number): Bytes.
    *   `createdAt` (timestamp): Server-side timestamp.
*  **User Orders** (Sub-collection) (`users/{uid}/orders`):
    *   `amountTotal` (number): Price in cents.
    *   `designImageUrl` (string): URL of the design printed.
    *   `shippingAddress` (object): Verified Stripe shipping data.
    *   `status` (string): 'processing', 'shipped'.


*   **Migrations**: Managed through application logic and Zod validation. Structural changes are handled by merging new fields during writes or via administrative scripts.
*   **Validation**: Zod is the primary tool for enforcing data integrity at the edge (Server Actions and API routes).

## Package Dependencies
*   @upstash/ratelimit: ^2.0.4
*   @upstash/redis: ^1.34.3
*   firebase: ^11.1.0
*   firebase-admin: ^13.0.1

# BREAKDOWN:
*   Granular rate limits added for Auth, Transactions, and Global traffic.
*   Updated Middleware to handle targeted DDoS mitigation.
*   Added dedicated Waitlist API endpoint (`/api/waitlist`).
*   Established formal NoSQL "schema" definitions for waitlist and contact collections.
*   Documented updated security posture and data management strategy in DEVELOPER_NOTES.md.