import React from 'react';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Box, Menu, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Navbar(){
    return (
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
                    <SheetHeader>
                        <SheetTitle className="sr-only">Main Menu</SheetTitle>
                    </SheetHeader>
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
                            <Link href="/contact" className="text-muted-foreground hover:text-foreground">Book a demo</Link>
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
    )
}