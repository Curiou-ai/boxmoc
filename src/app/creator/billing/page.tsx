
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2, CreditCard } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';
import { format } from "date-fns";

const plans = [
    { 
        name: "Starter", 
        priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!, 
        price: "$10/mo", 
        description: "For individuals and hobbyists.", 
        features: ["10 AI Credits", "Basic 3D Previews"],
        buttonText: "Subscribe",
    },
    { 
        name: "Pro", 
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!, 
        price: "$35/mo", 
        description: "For professionals and small teams.", 
        features: ["Unlimited AI Credits", "HD 3D Previews", "Team Collaboration (5 seats)"],
        buttonText: "Subscribe",
        isPopular: true,
    },
    { 
        name: "Enterprise", 
        priceId: '', // No direct checkout
        price: "Custom", 
        description: "For large organizations.", 
        features: ["Everything in Pro", "Dedicated Support", "API Access"],
        buttonText: "Contact Sales",
    },
];

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BillingPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<'checkout' | 'portal' | null>(null);
    const { toast } = useToast();

    const currentPriceId = user?.stripePriceId;
    const currentPlan = plans.find(p => p.priceId === currentPriceId);
    const subscriptionStatus = user?.stripeSubscriptionStatus;
    const isSubscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';

    const handleManageSubscription = async () => {
        setIsLoading('portal');
        try {
            const res = await fetch('/api/stripe/create-portal-link', { method: 'POST' });
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || 'Failed to create portal link.');
            }
            const { url } = await res.json();
            window.location.href = url;
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            setIsLoading(null);
        }
    };
    
    const handleSubscribe = async (priceId: string) => {
        if (!priceId) { // For "Contact Sales"
            window.location.href = '/contact';
            return;
        }
        setIsLoading('checkout');
        try {
            const res = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || 'Could not create checkout session.');
            }

            const { sessionId } = await res.json();
            const stripe = await stripePromise;
            const { error } = await stripe!.redirectToCheckout({ sessionId });
            if (error) throw new Error(error.message);

        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            setIsLoading(null);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold font-headline mb-2">Billing</h1>
                <p className="text-muted-foreground">Manage your payment methods and subscription plan.</p>
            </div>
            
            <div className="grid gap-8 max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Plan</CardTitle>
                        <CardDescription>
                            You are currently on the <span className="font-semibold text-primary">{currentPlan?.name || 'Free'}</span> plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map(plan => {
                            const isCurrentPlan = plan.priceId === currentPriceId;
                            return (
                                <Card key={plan.name} className={`flex flex-col ${isCurrentPlan ? 'border-primary' : ''}`}>
                                    <CardHeader>
                                        <CardTitle className="font-headline">{plan.name}</CardTitle>
                                        <p className="text-2xl font-bold">{plan.price}</p>
                                        <CardDescription>{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-2 text-sm">
                                            {plan.features.map(feature => (
                                                <li key={feature} className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    <span className="text-muted-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button 
                                            variant={isCurrentPlan ? 'default' : 'outline'} 
                                            className="w-full"
                                            disabled={isCurrentPlan || isLoading === 'checkout'}
                                            onClick={() => handleSubscribe(plan.priceId)}
                                        >
                                          {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                                          {isLoading === 'checkout' && !isCurrentPlan && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </CardContent>
                    {isSubscribed && user?.stripeCurrentPeriodEnd && (
                         <CardFooter className="border-t pt-6 flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div>
                                <p>Your plan renews on {format(new Date(user.stripeCurrentPeriodEnd * 1000), 'PPP')}.</p>
                                <p>Status: <span className="font-semibold capitalize text-primary">{subscriptionStatus}</span></p>
                            </div>
                            <Button onClick={handleManageSubscription} disabled={isLoading === 'portal'}>
                                {isLoading === 'portal' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                                Manage Billing & Invoices
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
