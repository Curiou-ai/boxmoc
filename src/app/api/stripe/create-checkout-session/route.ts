import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
    try {
        const { priceId, redirectPath = '/creator/billing' } = await request.json();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.stripeCustomerId) {
            return NextResponse.json({ error: 'Stripe customer not found for user.' }, { status: 400 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: session.stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            allow_promotion_codes: true,
            subscription_data: {
                trial_from_plan: true,
                metadata: {
                    firebaseUID: session.uid
                }
            },
            success_url: `${request.headers.get('origin')}${redirectPath}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}${redirectPath}`,
        });

        if (!checkoutSession.id) {
            throw new Error('Could not create checkout session');
        }

        return NextResponse.json({ sessionId: checkoutSession.id });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
