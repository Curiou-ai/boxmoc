'use client';

import { useEffect, useActionState } from 'react';
import { handleJoinWaitlist, WaitlistState, handleValidateAccessCode, AccessCodeState } from '@/app/actions';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Box, Mail, ArrowRight, KeyRound } from "lucide-react"
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

function AccessCodeForm() {
    const initialState: AccessCodeState = { message: '' };
    const [state, formAction] = useActionState(handleValidateAccessCode, initialState);

    return (
        <form action={formAction} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="access-code"
                        name="code"
                        type="text"
                        placeholder="Enter your access code"
                        required
                        className="pl-10 h-12 text-base"
                    />
                </div>
                <Button type="submit" size="lg" className="h-12 text-base">
                    Unlock Access <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
            {state.message && (
                <p className="text-sm text-destructive mt-2 text-left">{state.message}</p>
            )}
        </form>
    );
}

export default function WaitlistPage() {
    const { toast } = useToast();
    const initialState: WaitlistState = { message: '', success: false };
    const [joinWaitlistState, joinWaitlistAction] = useActionState(handleJoinWaitlist, initialState);

    useEffect(() => {
        if (joinWaitlistState.message && !joinWaitlistState.success) {
            toast({
                title: "Error",
                description: joinWaitlistState.message,
                variant: "destructive",
            });
        }
    }, [joinWaitlistState, toast]);

    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4">
             <header className="absolute top-0 left-0 right-0 px-4 lg:px-6 h-14 flex items-center">
                <Link href="/" className="flex items-center justify-center gap-2">
                <Box className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Boxmoc</span>
                </Link>
            </header>
            <main className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
                <div className="lg:w-1/2 text-center lg:text-left">
                    <div className="max-w-md mx-auto lg:mx-0">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline mb-4">
                            The Future of Design is Coming
                        </h1>
                        <p className="text-muted-foreground md:text-xl">
                            Be the first to know when Boxmoc launches. Join our waitlist for exclusive early access, updates, and special offers.
                        </p>
                        <form action={joinWaitlistAction} className="mt-8">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        required
                                        className="pl-10 h-12 text-base"
                                        defaultValue={joinWaitlistState.fields?.email}
                                    />
                                </div>
                                <Button type="submit" size="lg" className="h-12 text-base">
                                    Join the Waitlist <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                            {joinWaitlistState.message && !joinWaitlistState.success && (
                                <p className="text-sm text-destructive mt-2 text-left">{joinWaitlistState.message}</p>
                            )}
                        </form>
                    </div>
                    
                    <Separator className="my-12 max-w-md mx-auto lg:mx-0" />

                    <div className="max-w-md mx-auto lg:mx-0">
                        <h2 className="text-2xl font-bold font-headline mb-2">Have an access code?</h2>
                        <p className="text-muted-foreground mb-4">Enter your code below to get early access to the platform.</p>
                        <AccessCodeForm />
                    </div>

                </div>
                <div className="lg:w-1/2 flex items-center justify-center">
                    <Image
                        src="https://images.unsplash.com/photo-1620494218318-2e3d8847d7c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
                        width={600}
                        height={700}
                        alt="Abstract futuristic design"
                        data-ai-hint="abstract future technology"
                        className="rounded-2xl shadow-2xl object-cover aspect-[4/5]"
                    />
                </div>
            </main>
        </div>
    )
}
