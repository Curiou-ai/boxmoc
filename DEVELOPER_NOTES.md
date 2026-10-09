
# PROJECT
BOXMOC - Production SaaS Architecture

# DEVELOPER
Admin

# STATUS
1. Security Posture ✅
2. Data Management Architecture (SaaS Grade) ✅
3. Supply Chain Orchestration ✅

# NOTES:

## 🏗️ Architecture Overview (SaaS Grade)
Boxmoc is built as a multi-tenant logistics platform leveraging Google Cloud and Firebase.

### 1. Data Layer (Firestore NoSQL)
The database is structured for tenant isolation and global reporting.

#### `users` (Collection)
*   `uid`, `email`, `displayName`, `role` ('customer' | 'admin' | 'supplier'), `tenantId`, `stripeCustomerId`.

#### `orders` (Global Collection)
*   `orderId`, `userId`, `tenantId`, `status` ('CREATED' | 'PRICED' | 'MATCHED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED').
*   `designId`, `supplierId`, `logisticsId`, `price`, `quantity`, `createdAt`.

#### `designs` (Collection)
*   `designId`, `userId`, `dimensions` (w, h, d), `material`, `previewUrl`, `fileUrl`.

#### `suppliers` (Collection)
*   `supplierId`, `name`, `location`, `capabilities` (array), `rating`, `capacity`.

#### `shipments` (Collection)
*   `shipmentId`, `orderId`, `carrier`, `trackingNumber`, `status`, `estimatedDelivery`.

### 2. Core Supply Chain Logic
*   **Supplier Matching**: Orders are automatically routed to manufacturers based on a weighted score of Unit Cost (50%), Rating (30%), and Proximity (20%).
*   **Order Lifecycle**: Managed via Pub/Sub events (simulated in Server Actions for MVP) to trigger status transitions.

### 3. Notification System
*   **FCM**: Real-time push notifications for status updates.
*   **Resend/Nodemailer**: Transactional emails for confirmation and security.

## 🔒 Security Posture
*   **DDoS Protection**: Multi-tiered rate-limiting via Upstash Redis.
*   **RBAC**: Tenant-level isolation and role-level path protection.
*   **Input Validation**: Strict Zod schemas for all data entry points.

## Production Checklist
To move Boxmoc into a live production environment securely and reliably, here is a professional checklist of the critical items remaining. You have a solid foundation, but these steps will ensure you are protected against common launch-day failures:

🟧1. Observability & Monitoring
- Error Tracking: Integrate Sentry or LogRocket. In production, you won't see terminal logs; you need a system to capture client-side and server-side crashes in real-time.
- Heartbeat for MQTT: Since you have a local worker (orchestrator.ts) for the Bambu Lab printers, implement a "heartbeat." Have the worker update a last_seen timestamp in Firestore/Supabase every minute. If it stops, trigger an alert to your phone.

🟧2. DNS & Email Deliverability
- Domain Authentication: Ensure you configure SPF, DKIM, and DMARC records on your domain (e.g., GoDaddy/Cloudflare). Without these, your Resend/Nodemailer receipts will go straight to users' spam folders.
- Custom Domain for Webhooks: Ensure your Shopify and Stripe webhook URLs in their respective dashboards point to your production domain (not localhost or a temporary preview URL).

✅3. Legal & Compliance
- Privacy & Terms: Replace the placeholder /privacy-policy and /terms-of-service with actual legal documents. Since you process payments (Stripe) and personal design data, this is mandatory for liability protection.
- GDPR/CCPA: If you plan to serve users in Europe or California, ensure your CookieBanner actually blocks non-essential scripts until "Accept" is clicked.

✅4. SEO & Metadata
- Dynamic Meta Tags: While you have static metadata, you should add a sitemap.xml and robots.txt. Use Next.js generateMetadata on the blog and product pages to ensure that when someone shares a design, it has a rich preview image.

🟧5. Database and Secrets
- Secret Rotation: Ensure your SHOPIFY_WEBHOOK_SECRET and STRIPE_WEBHOOK_SECRET are stored in the environment manager of your hosting provider (Vercel/Firebase), never hardcoded.
- Migration Strategy: Before going live, run npx prisma migrate deploy against your Supabase production instance to ensure the relational schema is perfectly synced.

🟧6. Logistics & Fulfillment
- Address Validation: Users often make typos in shipping addresses. Consider adding a service like Smarty or Loqate to the checkout flow to prevent costly shipping failures.
- Tax Calculation: Ensure Shopify Tax is configured correctly for the regions you are shipping to.

🟧7. Performance
- Image Optimization: You are currently using picsum.photos for some assets. For production, host all static brand assets on Supabse/Cloudfare Storage or a CDN to ensure fast, global delivery.


Your current Middleware with Upstash rate-limiting is excellent and already ahead of most MVPs for DDoS protection. Once these final operational tasks are checked off, you'll be ready for a high-traffic launch!