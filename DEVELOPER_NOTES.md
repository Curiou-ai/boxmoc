
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
