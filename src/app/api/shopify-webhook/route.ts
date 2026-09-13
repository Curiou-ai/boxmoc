
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import admin from '@/lib/firebase-admin';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

/**
 * Production-ready handler for Shopify 'orders/paid' webhooks.
 * Validates HMAC signatures and synchronizes production data with Firestore.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');

    if (!SHOPIFY_WEBHOOK_SECRET || !hmacHeader) {
      return NextResponse.json({ error: 'Security credentials missing' }, { status: 401 });
    }

    // 1. HMAC Verification
    const generatedHash = crypto
      .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
      .update(rawBody, 'utf8')
      .digest('base64');

    if (generatedHash !== hmacHeader) {
      console.error('Invalid Webhook Signature detected.');
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const db = admin.firestore();

    // 2. Process Line Items to find Custom Designs
    const orderPromises = payload.line_items.map(async (item: any) => {
      // Extract the hidden design ID we injected during Cart Add
      const designIdAttr = item.properties?.find((p: any) => p.name === '_design_id');
      
      if (designIdAttr) {
        const orderData = {
          shopifyOrderId: payload.admin_graphql_api_id,
          shopifyOrderName: payload.name, // e.g. #1024
          designId: designIdAttr.value,
          quantity: item.quantity,
          amountTotal: parseFloat(item.price) * item.quantity,
          email: payload.email,
          printStatus: 'PENDING',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          customerInfo: {
            firstName: payload.customer?.first_name,
            lastName: payload.customer?.last_name,
          }
        };

        // Use Shopify Line Item ID as Firestore Doc ID to prevent duplicate processing
        await db.collection('orders').doc(item.admin_graphql_api_id.split('/').pop()!).set(orderData);
      }
    });

    await Promise.all(orderPromises);

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Shopify Webhook Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
