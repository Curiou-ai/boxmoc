
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, User } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';

const blogPosts = [
  {
    id: 1,
    title: "Solving branding exposure issues for SMEs who need care packages for their workforce.",
    description: "Discover how custom-branded care packages can boost employee morale while turning every team member into a brand ambassador.",
    date: "May 12, 2024",
    author: "Elena Rodriguez",
    imageId: "sme-care-packages"
  },
  {
    id: 2,
    title: "How we develop our supply chains to help equip growing demand.",
    description: "An inside look at Boxmoc's scalable logistics network and how we ensure rapid delivery even as order volumes skyrocket.",
    date: "May 10, 2024",
    author: "Marcus Chen",
    imageId: "supply-chain-growth"
  },
  {
    id: 3,
    title: "Taking control of event planning: Cutting labor costs and time with DIY branding.",
    description: "Learn how individuals are using our AI tools to design professional materials for weddings and parties without the agency price tag.",
    date: "May 08, 2024",
    author: "Sarah Jenkins",
    imageId: "event-planning-control"
  },
  {
    id: 4,
    title: "Our Origin Story: Building a faster path to professional marketing.",
    description: "The journey of Boxmoc from a simple idea to a powerhouse design platform built specifically for creators and small businesses.",
    date: "May 05, 2024",
    author: "David Volek",
    imageId: "origin-story"
  }
];

export function BlogCarousel() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Insights & Inspiration</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Stay updated with the latest trends in custom branding, design efficiency, and our company journey.
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="#">View All Articles <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {blogPosts.map((post) => {
              const img = placeholderData.blog.find(i => i.id === post.imageId);
              return (
                <Card key={post.id} className="min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-start flex flex-col border-none shadow-none bg-transparent group">
                  <CardHeader className="p-0 mb-4 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={img?.url || ''}
                      width={img?.width}
                      height={img?.height}
                      alt={img?.alt || ''}
                      data-ai-hint={img?.hint}
                      className="aspect-[3/2] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </CardHeader>
                  <CardContent className="p-0 flex-1 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                    </div>
                    <h3 className="text-xl font-bold font-headline leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-0 mt-4">
                    <Button variant="link" className="p-0 h-auto font-semibold text-primary" asChild>
                      <Link href={`#`}>Read More <ChevronRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-center mt-4 md:hidden">
           <Button variant="outline" asChild>
            <Link href="#">View All Articles <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
