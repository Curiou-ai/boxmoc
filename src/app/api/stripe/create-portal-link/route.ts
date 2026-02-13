import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.stripeCustomerId) {
            return NextResponse.json({ error: 'Stripe customer not found for user.' }, { status: 400 });
        }
        
        const { url } = await stripe.billingPortal.sessions.create({
            customer: session.stripeCustomerId,
            return_url: `${request.headers.get('origin')}/creator/billing`,
        });

        return NextResponse.json({ url });

    } catch (error: any) {
        console.error('Stripe Portal Link Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
