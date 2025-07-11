
'use client'; 

import { Package, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import React from 'react';

interface AppHeaderProps {
  mobileSidebar?: React.ReactNode;
  showTitle?: boolean;
}

export function AppHeader({ mobileSidebar, showTitle = true }: AppHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between border-b bg-card px-4 py-3 sm:px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        {mobileSidebar}
        <Link href="/" className="flex items-center gap-2 font-semibold md:hidden">
          <Package className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block font-bold">Boxmoc</span>
        </Link>
      </div>
      
      <div className="flex-1 text-center">
        {showTitle && <h1 className="text-lg font-semibold font-headline hidden md:block">Design Creator</h1>}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Share</span>
        </Button>
        <Button size="sm">
          <Save className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Save</span>
        </Button>
        <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/48x48.png" alt="User Avatar" data-ai-hint="woman smiling" />
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
