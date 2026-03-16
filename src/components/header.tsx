'use client'; 

import { Package, Share2, Save, Bell, Box, LogOut, User, CreditCard, Settings, ShoppingBag, LayoutDashboard } from 'lucide-react';
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
  const isAdmin = user?.role === 'admin';
  
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
        {/* <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Share</span>
        </Button> */}
        <Button size="sm" variant="ghost">
          <Bell className="h-4 w-4" />
          {/* <span className="hidden md:inline">Save</span> */}
        </Button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer border hover:border-primary transition-colors">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName || 'My Account'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="text-primary font-medium">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
               <DropdownMenuItem asChild>
                <Link href="/creator/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/creator/orders">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/creator/billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
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
