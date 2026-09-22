'use client';

import React from 'react';
import Navbar from '@/components/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Quote, Award, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';

export default function AboutPage() {
  const founderImg = placeholderData.about.find(i => i.id === 'founder');
  const floating1 = placeholderData.about.find(i => i.id === 'floating-1');
  const floating2 = placeholderData.about.find(i => i.id === 'floating-2');
  const floating3 = placeholderData.about.find(i => i.id === 'floating-3');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Floating Elements */}
        <section className="relative w-full py-20 lg:py-32 overflow-hidden flex items-center justify-center">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline leading-tight">
                Innovating the future of custom design
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                We're a dedicated team focused on building intelligent tools that simplify 
                custom packaging and drive meaningful brand growth.
              </p>
            </div>
          </div>

          {/* Floating Image Components inspired by reference */}
          <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 opacity-20 md:opacity-40 animate-bounce transition-all duration-1000">
            <Image src={floating1?.url || ''} width={200} height={200} alt="Design concept" className="rounded-2xl rotate-12" data-ai-hint={floating1?.hint} />
          </div>
          <div className="absolute bottom-20 left-20 w-24 h-24 md:w-40 md:h-40 opacity-20 md:opacity-40 animate-pulse transition-all">
            <Image src={floating2?.url || ''} width={200} height={200} alt="Design concept" className="rounded-2xl -rotate-6" data-ai-hint={floating2?.hint} />
          </div>
          <div className="absolute top-20 right-10 w-32 h-32 md:w-56 md:h-56 opacity-20 md:opacity-40 animate-pulse transition-all">
            <Image src={floating3?.url || ''} width={200} height={200} alt="Design concept" className="rounded-2xl -rotate-12" data-ai-hint={floating3?.hint} />
          </div>
          <div className="absolute bottom-10 right-20 w-28 h-28 md:w-44 md:h-44 opacity-20 md:opacity-40 animate-bounce transition-all">
            <Image src={floating1?.url || ''} width={200} height={200} alt="Design concept" className="rounded-2xl rotate-6" data-ai-hint={floating1?.hint} />
          </div>
        </section>

        {/* Mission & stats Section (Dark Theme) */}
        <section className="w-full py-20 bg-[#0c0c0c] text-white flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="outline" className="text-primary border-primary">Our Mission & Target</Badge>
              <h2 className="text-3xl md:text-5xl font-bold font-headline">Helping brands create better<br />materials and grow smarter</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-headline">Driven by a clear mission</h3>
                <p className="text-gray-400 leading-relaxed">
                  We aim to make powerful design tools accessible and easy to use for businesses of every size. 
                  Our mission is to simplify complexity through intuitive technology that helps brands 
                  create faster and deliver with confidence.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  With automation and AI-driven insights, we help teams eliminate friction in their workflow, 
                  focusing on what truly drives results. We're here to give creators the tools they need 
                  to turn quality ideas into professional reality.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-headline">The audience we serve</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our target audience includes SMEs, e-commerce brands, event planners, and creative agencies 
                  looking to optimize their product presentation. We work with teams that need deeper 
                  customization and more automated control over their physical assets.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  By offering a platform designed for flexibility and scale, we help these teams work smarter 
                  every day. From first concept to final delivery, we ensure they have everything they 
                  need to grow consistently.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-gray-800 pt-12">
              <div className="space-y-2">
                <p className="text-4xl font-bold font-headline">99%</p>
                <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Design Accuracy</p>
                <p className="text-gray-500 text-xs">Precise rendering across all 3D previews.</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold font-headline">1.8X</p>
                <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Faster Delivery</p>
                <p className="text-gray-500 text-xs">Automated workflows reduce production time.</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold font-headline">95%</p>
                <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Client Satisfaction</p>
                <p className="text-gray-500 text-xs">Top-rated support for professional creators.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="w-full py-20 lg:py-32 bg-background flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-accent opacity-20 rounded-2xl group-hover:opacity-30 transition-opacity" />
                <Image 
                  src={founderImg?.url || ''} 
                  width={800} 
                  height={800} 
                  alt="Boxmoc Founder" 
                  className="rounded-xl object-cover relative z-10 shadow-2xl"
                  data-ai-hint={founderImg?.hint}
                />
              </div>
              <div className="space-y-8">
                <Badge variant="outline">Founder</Badge>
                <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">The visionary behind the platform</h2>
                <div className="relative">
                  <Quote className="absolute -top-6 -left-6 h-12 w-12 text-primary/10" />
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground/80">
                    "I started this company with one belief: professional design should be predictable, 
                    measurable, and driven by real human creativity enhanced by AI. When strategy and insight 
                    come together, brand expression becomes a powerful engine for sustainable success."
                  </blockquote>
                </div>
                <div>
                  <p className="font-bold text-lg">Alex Rivera</p>
                  <p className="text-muted-foreground uppercase text-xs tracking-widest font-bold">CEO & Founder at Boxmoc</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="w-full py-20 bg-muted/30 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="outline">Awards</Badge>
              <h2 className="text-3xl md:text-5xl font-bold font-headline">Proven impact, celebrated<br />achievements</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Best Support', year: '2024', icon: <ShieldCheck className="h-10 w-10 text-primary" /> },
                { title: 'AI Innovator', year: '2023', icon: <Zap className="h-10 w-10 text-primary" /> },
                { title: 'Growth Leader', year: '2024', icon: <TrendingUp className="h-10 w-10 text-primary" /> },
                { title: 'Top 100 SaaS', year: '2024', icon: <Award className="h-10 w-10 text-primary" /> },
              ].map((award, i) => (
                <Card key={i} className="bg-card border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-muted rounded-full">
                      {award.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-tighter">{award.title}</p>
                      <p className="text-muted-foreground text-xs">{award.year}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-20 bg-primary text-primary-foreground flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center space-y-8">
            <h2 className="text-3xl md:text-6xl font-bold font-headline tracking-tighter">Ready to design your legacy?</h2>
            <p className="max-w-2xl mx-auto opacity-90 text-lg md:text-xl">
              Join thousands of brands that trust Boxmoc for their custom packaging and marketing needs.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8 h-14 text-lg font-bold">
              <Link href="/creator">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="w-full shrink-0 border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 max-w-7xl mx-auto items-center px-4 md:px-6">
          <p className="text-xs text-muted-foreground text-center sm:text-left">&copy; 2024 Boxmoc. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="/contact" className="text-xs hover:underline underline-offset-4">Contact</Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">Terms of Service</Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
