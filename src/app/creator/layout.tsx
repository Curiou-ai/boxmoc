
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Menu, Home, Settings, CreditCard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import RequestHelpDialog from '@/components/request-help-dialog';

const sidebarNavItems = [
    { href: '/creator', icon: Home, label: 'Editor' },
    { href: '/creator/billing', icon: CreditCard, label: 'Billing' },
    { href: '#', icon: Settings, label: 'Settings' },
];

const SidebarNav = ({ isExpanded }: { isExpanded: boolean }) => {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <nav className="flex flex-col items-center gap-2 px-2 sm:py-5">
                {sidebarNavItems.map((item) => (
                    <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                                    pathname === item.href && 'bg-accent text-accent-foreground'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="sr-only">{item.label}</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>{item.label}</TooltipContent>
                    </Tooltip>
                ))}
            </nav>
        </TooltipProvider>
    );
};


export default function CreatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const mobileSidebar = (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0 overflow-y-auto bg-card border-r text-foreground">
                <nav className="flex flex-col gap-4 p-4">
                    {sidebarNavItems.map(item => (
                         <Link key={item.href} href={item.href}>
                            <Button variant="ghost" className="w-full justify-start gap-3">
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Button>
                         </Link>
                    ))}
                </nav>
                <div className="p-2 mt-auto border-t">
                     <RequestHelpDialog>
                        <Button variant="secondary" className="w-full justify-start gap-3">
                            <Users className="h-5 w-5" />
                            Request Help
                        </Button>
                     </RequestHelpDialog>
                </div>
            </SheetContent>
        </Sheet>
    );


    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AppHeader mobileSidebar={mobileSidebar} />
            <div className="flex flex-1">
                <aside className="hidden md:flex md:w-14 flex-col border-r bg-background">
                   <SidebarNav isExpanded={false} />
                </aside>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
