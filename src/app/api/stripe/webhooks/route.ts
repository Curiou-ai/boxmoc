
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import admin from '@/lib/firebase-admin';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.created',
]);

async function manageSubscriptionStatusChange(subscriptionId: string, customerId: string) {
    const db = admin.firestore();
    const userQuerySnapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();

    if (userQuerySnapshot.empty) {
        console.error(`Webhook Error: User not found for stripeCustomerId: ${customerId}`);
        return;
    }
    const userDoc = userQuerySnapshot.docs[0];

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method']
    });

    const subscriptionData = {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionStatus: subscription.status,
        stripeCurrentPeriodEnd: subscription.current_period_end,
    };

    await userDoc.ref.update(subscriptionData);
    console.log(`Updated subscription for user ${userDoc.id} in Firestore.`);
}

async function handleOrderFulfillment(session: Stripe.Checkout.Session) {
    const { userId, designImageUrl, designDescription } = session.metadata || {};

    if (!userId || !session.shipping_details) {
        console.error(`Webhook Error: Missing userId or shipping_details for session ${session.id}.`);
        return;
    }
    
    const orderData = {
        userId: userId,
        amountTotal: session.amount_total,
        designImageUrl: designImageUrl,
        designDescription: designDescription,
        shippingAddress: {
            name: session.shipping_details.name,
            address: session.shipping_details.address,
        },
        status: 'processing', // Initial status after payment
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const db = admin.firestore();
    // Use session.id as a unique ID to prevent duplicate orders on webhook retries
    await db.collection('users').doc(userId).collection('orders').doc(session.id).set(orderData);
    console.log(`Successfully created order ${session.id} for user ${userId}.`);
}

export async function POST(request: Request) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === 'subscription' && checkoutSession.subscription) {
                        await manageSubscriptionStatusChange(
                            checkoutSession.subscription as string,
                            checkoutSession.customer as string
                        );
                    } else if (checkoutSession.mode === 'payment') {
                        await handleOrderFulfillment(checkoutSession);
                    }
                    break;
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                     await manageSubscriptionStatusChange(
                        subscription.id,
                        subscription.customer as string
                    );
                    break;
                default:
                    // This should not happen if `relevantEvents` is correct.
                    // throw new Error('Unhandled relevant event!');
                    console.warn(`Unhandled relevant event type: ${event.type}`);
            }
        } catch (error) {
            console.error('Stripe webhook handler error:', error);
            return new NextResponse('Webhook handler failed. See logs.', { status: 500 });
        }
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}
