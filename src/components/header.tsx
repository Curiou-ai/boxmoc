
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
    <header className="flex justify-center w-full p-4">
      <div className="flex items-center justify-between w-full max-w-7xl px-4 py-3 border bg-card shadow-sm z-10 rounded-xl">

      <div className="flex items-center">
        {mobileSidebar}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <h1 className="hidden sm:block text-xl sm:text-2xl font-bold font-headline text-foreground whitespace-nowrap">Boxmoc</h1>
        </Link>
      </div>

      {/* Navigation links - hidden on mobile */}
      <nav className="hidden md:flex items-center gap-6 flex-grow justify-center">
        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Product</Link>
        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Solutions</Link>
        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Resources</Link>
        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
      </nav>

      <div className="flex items-center gap-4">
        {/* 'Book a demo' button */}
        <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-600 hover:text-gray-900">
          Book a demo
        </Button>
        {/* 'Login' button */}
        <Button variant="outline" size="sm" className="text-sm">
          <Save className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Login</span>
        </Button>
        {/* 'Sign up free' button */}
        <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded">
          <Share2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Sign up free</span>
        </Button>
      </div>
      </div>
    </header>
  );
}
