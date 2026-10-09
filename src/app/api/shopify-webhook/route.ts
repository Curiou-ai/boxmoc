import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

/**
 * Production-ready handler for Shopify 'orders/paid' webhooks.
 * Uses Prisma ORM to synchronize data with a relational database (e.g. Supabase).
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
    
    if (!SHOPIFY_WEBHOOK_SECRET || !hmacHeader) {
      return NextResponse.json({ error: 'Security credentials missing' }, { status: 401 });
    }

    // 1. HMAC Verification to ensure request is from Shopify
    const generatedHash = crypto
      .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
      .update(rawBody, 'utf8')
      .digest('base64');

    if (generatedHash !== hmacHeader) {
      console.error('Invalid Shopify Webhook Signature.');
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // 2. Identify the customer
    const customerEmail = payload.email || payload.customer?.email;
    if (!customerEmail) {
        return NextResponse.json({ error: 'Missing customer identity' }, { status: 400 });
    }

    // Find the internal user to link the order
    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    // 3. Process Line Items to find Custom 3D Designs
    const orderPromises = payload.line_items.map(async (item: any) => {
      // Extract the hidden design ID injected during checkout initiation
      const designIdAttr = item.properties?.find((p: any) => p.name === '_design_id');
      
      if (designIdAttr) {
        const designId = designIdAttr.value;

        // Verify the design exists in our relational database
        const design = await prisma.design.findUnique({
          where: { id: designId },
        });

        if (!design) {
          console.error(`Referential Integrity Error: Design ${designId} not found for Order ${payload.name}`);
          return;
        }

        // Use Shopify GID part as a unique identifier for the Order model
        const shopifyUniqueId = item.admin_graphql_api_id.split('/').pop()!;

        // 4. Record the transaction in the database
        // We use upsert to handle potential webhook retries from Shopify
        return prisma.order.upsert({
          where: { shopifyOrderId: shopifyUniqueId },
          update: {
            printStatus: 'PENDING', // Reset or maintain pending status on payment
          },
          create: {
            shopifyOrderId: shopifyUniqueId,
            shopifyOrderName: payload.name,
            designId: design.id,
            userId: user?.id || design.userId, // Fallback to designer's ID if user lookup fails
            quantity: item.quantity,
            amountTotal: Math.round(parseFloat(item.price) * item.quantity * 100), // Store in cents
            printStatus: 'PENDING',
            createdAt: new Date(payload.created_at || Date.now()),
            shippingAddress: payload.shipping_address ? {
              name: `${payload.shipping_address.first_name} ${payload.shipping_address.last_name}`,
              address1: payload.shipping_address.address1,
              city: payload.shipping_address.city,
              province: payload.shipping_address.province,
              country: payload.shipping_address.country,
              zip: payload.shipping_address.zip,
            } : null,
          },
        });
      }
    });

    await Promise.all(orderPromises);

    return NextResponse.json({ success: true, message: 'Relational sync complete' });
  } catch (error: any) {
    console.error('Shopify Relational Webhook Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
