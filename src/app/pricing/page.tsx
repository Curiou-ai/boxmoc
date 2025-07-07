
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Box, Check, Rocket, Sparkles, Menu, ChevronDown } from "lucide-react"
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AnnouncementBar } from '@/components/announcement-bar';

const pricingPlans = [
    {
        name: 'Starter',
        icon: Box,
        description: 'Perfect for individuals and hobbyists starting out with AI-powered design.',
        monthlyPrice: 10.99,
        yearlyPrice: 9,
        isTrial: true,
        discountInfo: {
            text: "Originally $29/mo - Save over 60%",
            subtext: "No credit card required for trial"
        },
        features: [
            '10 AI Design Generations / month',
            'Standard 3D Previews',
            'Access to Basic Templates',
            '1 User Seat',
            'Community Support',
            'Export Watermarked Designs'
        ],
        buttonText: 'Start Free Trial Now',
        buttonLink: '/signup',
        popular: false,
    },
    {
        name: 'Pro',
        icon: Rocket,
        description: 'For professionals and small teams who need advanced features and more creative power.',
        monthlyPrice: 35,
        yearlyPrice: 30,
        features: [
            'Unlimited AI Design Generations',
            'High-Resolution 3D Previews',
            'Premium Template Library',
            'Up to 5 Team Members',
            'Priority Email Support',
            'Upload Custom Assets & Logos'
        ],
        buttonText: 'Get Pro',
        buttonLink: '/signup',
        popular: true,
    },
    {
        name: 'Enterprise',
        icon: Sparkles,
        description: 'For large organizations requiring custom solutions, advanced security, and dedicated support.',
        priceText: 'Custom',
        features: [
            'Everything in Pro, plus:',
            'Custom Integrations & API Access',
            'Advanced Security & Compliance',
            'Unlimited Team Members',
            'Dedicated Account Manager',
            '24/7 Premium Support'
        ],
        buttonText: 'Contact Sales',
        buttonLink: '/contact',
        popular: false,
    }
];


export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <AnnouncementBar />
      <header className="sticky top-0 z-50 w-full py-3">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border bg-card/75 px-4 shadow-lg sm:px-6 backdrop-blur-sm">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Box className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Boxmoc</span>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground">
                  Product <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Packaging</DropdownMenuItem>
                  <DropdownMenuItem>Marketing Materials</DropdownMenuItem>
                  <DropdownMenuItem>Event Promotions</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground">
                  Solutions <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>For E-commerce</DropdownMenuItem>
                  <DropdownMenuItem>For Agencies</DropdownMenuItem>
                  <DropdownMenuItem>For Startups</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground">
                  Resources <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Blog</DropdownMenuItem>
                  <DropdownMenuItem>Help Center</DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/contact">Contact</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" asChild>
              <Link href="/contact">Book a demo</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/creator">Sign up free</Link>
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-4 p-6 text-lg font-medium">
                  <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
                    <Box className="h-6 w-6 text-primary" />
                    <span className="font-bold">Boxmoc</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">Product</Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">Solutions</Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">Resources</Link>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
                  <div className="border-t pt-4 mt-2 grid gap-4">
                      <Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
                      <Button asChild className="w-full">
                          <Link href="/creator">Sign up free</Link>
                      </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-grow py-12 md:py-24">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">Find the perfect plan for your creative needs</h1>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
              From solo creators to enterprise teams, our flexible plans are designed to help you create stunning designs with the power of AI.
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
                  <div key={plan.name} className="relative pt-6 h-full">
                    {plan.isTrial && (
                      <Badge className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 hover:bg-amber-400/90 font-bold px-4 py-1 text-sm">
                        7-DAY FREE TRIAL
                      </Badge>
                    )}
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
                              {!isCustom && isYearly && (
                                  <p className="text-sm font-medium text-muted-foreground">Billed annually</p>
                              )}
                          </div>

                          {plan.isTrial && plan.discountInfo && !isYearly && (
                            <div className="bg-muted/50 text-center p-3 rounded-lg border">
                              <p className="font-semibold text-sm text-foreground">{plan.discountInfo.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">{plan.discountInfo.subtext}</p>
                            </div>
                          )}
                       
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
                                  plan.popular && 'bg-gradient-to-r from-pink-500 to-orange-400 text-primary-foreground hover:opacity-90',
                                  plan.isTrial && 'bg-amber-500 text-amber-900 hover:bg-amber-500/90',
                                  plan.name === 'Enterprise' && !plan.popular && 'bg-gradient-to-r from-accent to-primary text-primary-foreground hover:opacity-90'
                              )}
                          >
                              <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
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
