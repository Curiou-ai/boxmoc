'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, Box, BrainCircuit, Paintbrush, Menu, ChevronDown, Languages, Users, Info } from 'lucide-react'
import Navbar from '@/components/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import FeaturesTabs from '@/components/features-tabs'
import { ServicesAccordion } from '@/components/services-accordion'
import Testimonials from '@/components/testimonials'
import { WorkflowSteps } from '@/components/workflow-steps'
import { AnnouncementBar } from '@/components/announcement-bar'
import { translateHeadline } from './actions';
import DashboardHero from '@/components/ui/dashboard';
import BoxmocAI from '@/components/ui/chatbot-svg';
import { BlogCarousel } from '@/components/blog-carousel';
import { Badge } from '@/components/ui/badge';
import { FaqSection } from '@/components/faq-section';

const languages = [
    { code: 'en', name: 'English', original: 'Your Brand, Delivered' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
];

export default function LandingPage() {
  const [headline, setHeadline] = useState('Your Brand, Delivered');
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
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline mb-4">
                  {headline}
                </h1>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                  Create custom printed boxes. Delivered right to your doorstep.
                </p>
              </div>
              <div className="w-full max-w-xs space-y-8 mb-6">
                <form className="flex flex-col gap-5">
                  <Button type="submit" asChild size="lg" className="w-full mb-8">
                    <Link href="/creator">
                      Get Started
                    </Link>
                  </Button>
                </form>
              </div>
              <div className="w-full mx-auto">
                <DashboardHero />
              </div>
            </div>
          </div>
        </section>

        

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
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

        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="p-1 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <div className="bg-card text-card-foreground rounded-xl p-6 md:p-12 lg:p-16 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
                      Supercharge Your Creativity with Boxmoc AI
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                      Let our AI be your co-designer. Instantly generate unique concepts for your branded products. Get smart suggestions and refine your ideas in seconds. Go from a simple prompt to a production-ready design faster than ever before.
                    </p>
                    <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                      <Link href="/creator">Learn More</Link>
                    </Button>
                  </div>
                  <div className='flex items-center justify-start md:justify-center'>
                    <BoxmocAI className='rounded-lg shadow-2xl max-w-sm border border-primary'/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WorkflowSteps />

        <section id="services" className="w-full py-12 md:py-24 min-[896px]:py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col min-[896px]:flex-row gap-10 min-[896px]:gap-16 items-center">
              <div className="space-y-6 min-[896px]:w-1/2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                  The one place to gather and build
                </h2>
                <ServicesAccordion />
              </div>
              <div className="bg-accent/50 rounded-2xl min-[896px]:w-1/2">
                  <Image
                    src="https://images.unsplash.com/photo-1716471330463-f475b00f0506?q=80&w=2070&h=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                    width="2070"
                    height="2070"
                    alt="Design team collaborating"
                    data-ai-hint="design team collaboration"
                    className="rounded-xl shadow-2xl w-full h-full object-cover"
                  />
              </div>
            </div>
          </div>
        </section>

        <section id="clients" className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
            <div className="container px-4 md:px-6 max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Built for Endless Creativity
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    The tools and flexibility you need to create
                </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                <div>
                    <div className="relative mb-8 overflow-hidden rounded-xl">
                    <Image
                        src="https://images.unsplash.com/photo-1609143739217-01b60dad1c67?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3"
                        width={600}
                        height={450}
                        alt="Custom API integration example"
                        data-ai-hint="code editor API"
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <h3 className="text-2xl font-bold font-headline">For Any Industry</h3>
                    <p className="mt-4 text-muted-foreground">
                    Whether you're in marketing, events, or retail, Boxmoc provides powerful tools to create designs that resonate with your audience and elevates your brand.
                    </p>
                    <Button asChild variant="secondary" className="mt-6">
                    <Link href="#">See Use Cases</Link>
                    </Button>
                </div>

                <div>
                    <div className="relative mb-8 overflow-hidden rounded-xl">
                    <Image
                        src="https://images.unsplash.com/photo-1686575131650-e02f84970212?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.0.3"
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
                    {/* <Button asChild variant="secondary" className="mt-6">
                    <Link href="/creator">Get Started</Link>
                    </Button> */}
                    <Button type="submit" asChild className="mt-6">
                      <Link href="/creator">
                        Get Started
                      </Link>
                    </Button>
                </div>
                </div>
            </div>
        </section>

        <Testimonials />

        <BlogCarousel />

        {/* About Section - Teaser inspired by design reference */}
        <section className="w-full py-16 md:py-24 bg-background flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {/* <Badge variant="outline" className="px-4 py-1 text-primary border-primary/30 bg-primary/5 uppercase tracking-widest font-bold text-[10px]">
                  Innovating since 2024
                </Badge> */}
                <h2 className="text-3xl md:text-5xl font-bold font-headline leading-tight">
                  Innovating the future of custom brand expression
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Boxmoc is more than just a packaging platform. We are a dedicated team focused on building 
                  intelligent, design tools that simplify complexity and drive meaningful growth.
                </p>
                <Button asChild size="lg" className="rounded-full px-8 group">
                  <Link href="/about">
                    Learn Our Story <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="space-y-4 pt-12">
                   <div className="bg-primary/10 rounded-2xl aspect-square flex items-center justify-center p-6 border border-primary/20">
                      <BrainCircuit className="h-12 w-12 text-primary" />
                   </div>
                   <div className="bg-accent/10 rounded-2xl aspect-[3/4] flex items-center justify-center p-6 border border-accent/20">
                      <Image 
                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&h=600&auto=format&fit=crop"
                        width={400} height={600} alt="Interior Design" className="rounded-xl object-cover h-full opacity-60"
                      />
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl aspect-[3/4] flex items-center justify-center p-6 border shadow-xl">
                      <div className="text-center">
                         <p className="text-4xl font-bold font-headline mb-1">99%</p>
                         <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Precision</p>
                      </div>
                   </div>
                   <div className="bg-muted rounded-2xl aspect-square flex items-center justify-center p-6 border">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FaqSection />

        <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-card flex items-center justify-center">
          <div className="container grid grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 items-center justify-center px-4 md:px-6 max-w-7xl">
            <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Create Your Masterpiece?</h2>
              <p className="max-w-md text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start creating your custom boxes today. Create an account and get started.
              </p>

              <div className="flex items-center gap-4">
                <Button asChild size="sm" className="">
                  <Link href="/creator" className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white transition">
                    Start Now
                    <span className="ml-2">›</span>
                  </Link>
                </Button>

                <Link
                  href="/contact"
                  className="text-sm font-medium hover:text-blue-400 transition"
                >
                  Contact sales ›
                </Link>
              </div>
            </div>
            <div className="relative space-y-4 md:pl-10">
              <div className="hidden md:absolute md:left-0 md:top-0 md:h-full md:w-px md:bg-slate-200" />

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <BrainCircuit className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-semibold tracking-tighter md:text-xl/tight font-headline">
                Pricing For You
              </h3>

              <p className="text-sm text-muted-foreground">
                Transparent, predictable pricing with no hidden fees — built for
                creators and growing teams.
              </p>

              <Link
                href="/pricing"
                className="inline-flex items-center text-sm font-medium hover:text-blue-400 transition"
              >
                Pricing details ›
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full shrink-0 border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 max-w-7xl mx-auto items-center px-4 md:px-6">
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
