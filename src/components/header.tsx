
'use client'; 

import { Package, Share2, Save, Box, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppHeaderProps {
  mobileSidebar?: React.ReactNode;
}

export function AppHeader({ mobileSidebar }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  
  return (
    <header className="flex w-full items-center justify-between border-b bg-card px-4 py-3 sm:px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        {mobileSidebar}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-bold">Boxmoc</span>
        </Link>
      </div>
      
      <div className="flex-1 text-center">
        {/* Title removed for cleaner header */}
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
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={user.photoURL || "https://placehold.co/48x48.png"} alt="User Avatar" data-ai-hint="woman smiling" />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/creator/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
           <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/48x48.png" alt="User Avatar" data-ai-hint="woman smiling" />
              <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
