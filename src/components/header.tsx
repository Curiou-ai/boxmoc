
'use client'; 

import { Package, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import React from 'react';

interface AppHeaderProps {
  mobileSidebar?: React.ReactNode;
}

export function AppHeader({ mobileSidebar }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-2 sm:p-4 border-b bg-card shadow-sm z-10">
      <div className="flex items-center gap-2">
        {mobileSidebar}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <h1 className="hidden sm:block text-xl sm:text-2xl font-bold font-headline text-foreground">Boxmoc</h1>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="sm:size-auto">
          <Save className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Save</span>
        </Button>
        <Button size="sm" className="sm:size-auto">
          <Share2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Share</span>
        </Button>
        <Avatar className="ml-2 h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="avatar person" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
