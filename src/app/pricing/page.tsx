
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Box, ArrowLeft, Check, Globe, Rocket, Sparkles } from "lucide-react"
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const pricingPlans = [
    {
        name: 'Basic Plan',
        icon: Globe,
        description: 'Perfect for individuals or small teams looking to stay organized with basic features.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            'Basic task management',
            'Personal calendar',
            'Task reminders',
            'Collaboration with 3 team members',
            'Limited file storage (up to 1 GB)',
            'Access to mobile and desktop apps'
        ],
        buttonText: 'Start for free',
        buttonLink: '/signup',
        popular: false,
    },
    {
        name: 'Pro',
        icon: Rocket,
        description: 'Ideal for growing teams needing more robust tools and integrations.',
        monthlyPrice: 35,
        yearlyPrice: 30,
        features: [
            'Advanced task management',
            'Shared team calendar',
            'Unlimited team collaboration',
            '50 GB file storage',
            'Priority customer support',
            'Integrations with popular apps'
        ],
        buttonText: 'Get Pro',
        buttonLink: '/signup',
        popular: true,
    },
    {
        name: 'Enterprise',
        icon: Sparkles,
        description: 'Designed for businesses requiring comprehensive, scalable management tools.',
        priceText: 'Custom',
        features: [
            'Custom solutions',
            'Unlimited file storage',
            'Advanced security',
            'Detailed analytics',
            'Dedicated account manager',
            '24/7 premium support'
        ],
        buttonText: 'Get Enterprise',
        buttonLink: '/contact',
        popular: false,
    }
];


export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b shrink-0">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Boxmoc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow py-12 md:py-24">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">Pricing</h1>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
              Do more impactful work with a privacy first calendar that plugs into all your apps at work.
            </p>
          </div>
          
          <div className="flex justify-center mb-10">
            <Tabs defaultValue="monthly" onValueChange={setBillingCycle} className="w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {pricingPlans.map((plan) => {
                const isYearly = billingCycle === 'yearly';
                const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                const isCustom = plan.priceText === 'Custom';
                
                return (
                  <Card key={plan.name} className={cn('flex flex-col h-full rounded-2xl', plan.popular ? 'border-2 border-pink-500 shadow-xl' : 'border')}>
                    <CardHeader className="items-start space-y-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="p-3 bg-muted rounded-lg">
                                <plan.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-xl">{plan.name}</CardTitle>
                            {plan.popular && <Badge className="ml-auto bg-pink-100 text-pink-600 border border-pink-300 hover:bg-pink-100">Most Popular</Badge>}
                        </div>
                      <CardDescription className="pt-2">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-6">
                        <div className="flex justify-between items-baseline">
                            {isCustom ? (
                                <p className="text-4xl font-bold">{plan.priceText}</p>
                            ) : (
                                <p>
                                    <span className="text-4xl font-bold">${price}</span>
                                    <span className="text-muted-foreground"> per month</span>
                                </p>
                            )}
                            {plan.name !== 'Basic Plan' && isYearly && (
                                <p className="text-sm font-medium text-muted-foreground">Billed annually</p>
                            )}
                        </div>
                       
                      <ul className="space-y-3 text-sm">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                       <Button 
                            asChild 
                            variant={plan.popular ? 'default' : 'outline'} 
                            className={cn('w-full', 
                                plan.name === 'Pro' && 'bg-gradient-to-r from-pink-500 to-orange-400 text-primary-foreground hover:opacity-90',
                                plan.name === 'Enterprise' && 'bg-gradient-to-r from-accent to-primary text-primary-foreground hover:opacity-90'
                            )}
                        >
                            <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                       </Button>
                    </CardFooter>
                  </Card>
                );
            })}
          </div>

        </div>
      </main>

       <footer className="w-full shrink-0 border-t mt-auto">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 max-w-7xl items-center px-4 md:px-6">
            <p className="text-xs text-muted-foreground text-center sm:text-left">&copy; 2024 Boxmoc. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link href="/contact" className="text-xs hover:underline underline-offset-4">
                Contact
              </Link>
              <Link href="/terms-of-service" className="text-xs hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="text-xs hover:underline underline-offset-4">
                Privacy
              </Link>
            </nav>
        </div>
      </footer>
    </div>
  )
}
