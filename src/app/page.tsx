
'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, Box, BrainCircuit, Paintbrush, Menu, ChevronDown, Languages } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import FeaturesTabs from '@/components/features-tabs'
import { ServicesAccordion } from '@/components/services-accordion'
import Testimonials from '@/components/testimonials'
import { WorkflowSteps } from '@/components/workflow-steps'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AnnouncementBar } from '@/components/announcement-bar'
import { translateHeadline } from './actions';

const languages = [
    { code: 'en', name: 'English', original: 'Design Your Perfect Creation with AI' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
];

export default function LandingPage() {
  const [headline, setHeadline] = useState('Design Your Perfect Creation with AI');
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (languageCode: string) => {
    const selectedLanguage = languages.find(l => l.code === languageCode);
    if (!selectedLanguage) return;

    if (languageCode === 'en') {
        setHeadline(selectedLanguage.original!);
        return;
    }

    startTransition(async () => {
        const result = await translateHeadline(headline, selectedLanguage.name);
        if (result.translatedText) {
            setHeadline(result.translatedText);
        }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Languages className="h-5 w-5" />
                        <span className="sr-only">Change language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languages.map((lang) => (
                         <DropdownMenuItem key={lang.code} onSelect={() => handleLanguageChange(lang.code)}>
                            {lang.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
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
          <div className="lg:hidden flex items-center gap-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Languages className="h-5 w-5" />
                        <span className="sr-only">Change language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     {languages.map((lang) => (
                         <DropdownMenuItem key={lang.code} onSelect={() => handleLanguageChange(lang.code)}>
                            {lang.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
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

      <main className="flex-1 pt-4">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  {headline}
                </h1>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                  Bring your creative ideas to life. Our intuitive tools and powerful AI make it easy to create stunning, custom designs for packaging, marketing materials, and events in minutes.
                </p>
              </div>
              <div className="w-full max-w-xs space-y-4">
                <form className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-11"
                    aria-label="Email"
                  />
                  <Button type="submit" asChild size="lg" className="w-full">
                    <Link href="/creator">
                      Get Started for Free
                    </Link>
                  </Button>
                </form>
              </div>
              <Image
                src="https://placehold.co/800x450.png"
                width="800"
                height="450"
                alt="Hero"
                data-ai-hint="packaging product mockup"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-contain w-full max-w-4xl"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Better Way to Design</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  From first idea to final product, Boxmoc streamlines your creative process. Explore the features that make designing effortless and fun.
                </p>
              </div>
              <div className="w-full max-w-5xl">
                <FeaturesTabs />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="p-1 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <div className="bg-card text-card-foreground rounded-xl p-8 md:p-12 lg:p-16">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
                      Supercharge Your Creativity with Boxmoc AI
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                      Let our AI be your co-designer. Instantly generate unique concepts for packaging, flyers, cards, and more. Get smart suggestions and refine your ideas in seconds. Go from a simple prompt to a production-ready design faster than ever before.
                    </p>
                    <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                      <Link href="/creator">Learn More</Link>
                    </Button>
                  </div>
                  <div>
                    <Image
                      src="https://placehold.co/600x450.png"
                      width="600"
                      height="450"
                      alt="AI Feature"
                      data-ai-hint="AI design tool"
                      className="rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WorkflowSteps />

        <section id="services" className="w-full py-12 md:py-24 min-[896px]:py-32">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col min-[896px]:flex-row gap-10 min-[896px]:gap-16 items-center">
              <div className="space-y-6 min-[896px]:w-1/2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                  The one place where all teams gather to build together
                </h2>
                <ServicesAccordion />
              </div>
              <div className="bg-accent/50 rounded-2xl p-4 md:p-6 min-[896px]:p-8 min-[896px]:w-1/2">
                  <Image
                    src="https://placehold.co/600x500.png"
                    width="600"
                    height="500"
                    alt="Design team collaborating"
                    data-ai-hint="design team collaboration"
                    className="rounded-xl shadow-2xl w-full h-full object-cover"
                  />
              </div>
            </div>
          </div>
        </section>

        <section id="clients" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Built for Endless Creativity
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    From corporate events to e-commerce brands, Boxmoc provides the tools and flexibility for any team to create the perfect promotional materials, packaging, and more.
                </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                {/* Left Column: Client types */}
                <div>
                    <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 mb-8">
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.44.25a2 2 0 0 1-2 1.73V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.29a2 2 0 0 0-1-1.73l-4.44-2.54a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><path d="M18 13.13V22"></path><path d="M6 13.13V22"></path><path d="M12 13.13V22"></path></svg></div>
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></div>
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg></div>
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg></div>
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M12 12h.01"></path></svg></div>
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><circle cx="12" cy="12" r="10"></circle><path d="m14.31 8 5.74 9.94"></path><path d="M9.69 8h11.48"></path><path d="m7.38 12 5.74-9.94"></path><path d="M9.69 16 3.95 6.06"></path><path d="M14.31 16H2.83"></path><path d="m16.62 12-5.74 9.94"></path></svg></div>
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l10-10A1 1 0 0 0 22 12V2h-4"></path><path d="M7 7h.01"></path></svg></div>
                        <div className="flex items-center justify-center p-2 bg-background rounded-lg shadow-sm aspect-square"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg></div>
                    </div>
                    <h3 className="text-2xl font-bold font-headline">For Any Industry</h3>
                    <p className="mt-4 text-muted-foreground">
                    Whether you're in marketing, events, or retail, Boxmoc provides powerful tools to create designs that resonate with your audience and elevates your brand.
                    </p>
                    <Button asChild variant="secondary" className="mt-6">
                    <Link href="#">See Use Cases</Link>
                    </Button>
                </div>

                {/* Right Column: API / Customization */}
                <div>
                    <div className="relative mb-8 overflow-hidden rounded-xl">
                    <Image
                        src="https://placehold.co/600x450.png"
                        width={600}
                        height={450}
                        alt="Custom API integration example"
                        data-ai-hint="code editor API"
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <h3 className="text-2xl font-bold font-headline">Powerful Customization</h3>
                    <p className="mt-4 text-muted-foreground">
                    Take full control with our easy-to-use design tools. Upload assets, create designs for cards, flyers, and packaging, and see your vision come to life in stunning 3D.
                    </p>
                    <Button asChild variant="secondary" className="mt-6">
                    <Link href="/creator">Explore the Tools</Link>
                    </Button>
                </div>
                </div>
            </div>
        </section>

        <Testimonials />

        <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 max-w-7xl">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Create Your Masterpiece?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start creating your custom designs today. It's free to get started.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/creator">
                  Start Designing Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full shrink-0 border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 max-w-7xl items-center px-4 md:px-6">
            <p className="text-xs text-muted-foreground text-center sm:text-left">&copy; 2024 Boxmoc. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link href="/contact" className="text-xs hover:underline underline-offset-4">
                Contact
              </Link>
              <Link href="#" className="text-xs hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs hover:underline underline-offset-4">
                Privacy
              </Link>
            </nav>
        </div>
      </footer>
    </div>
  )
}
