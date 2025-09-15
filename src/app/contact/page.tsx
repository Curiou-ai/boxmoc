
'use client';

import { useActionState } from 'react';
import { handleRequestHelp } from '@/app/actions';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { Box, Phone, ArrowLeft, MapPin, Mail, Send } from "lucide-react"
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function ContactPage() {
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(handleRequestHelp, { message: '', success: false });

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Message Sent!" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
        }
    }, [state, toast]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Boxmoc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
          </Button>
        </nav>
      </header>
      <main className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Talk to an expert</h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mt-4">
                        Have questions about pricing, plans, or how Boxmoc can work for you? Fill out the form and a product specialist will be in touch.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline">Our Offices</h2>
                     <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <h3 className="font-semibold">United Kingdom</h3>
                            <address className="not-italic text-muted-foreground space-y-2">
                                <p className="flex items-start gap-2">
                                    <MapPin className="h-5 w-5 mt-1 shrink-0" />
                                    <span>30 Eastbourne Terrace<br/>Paddington, London<br/>W2 6LA, UK</span>
                                </p>
                                 <p className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    <a href="tel:+441351351051" className="hover:underline">+44 13 5135 1051</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    <a href="mailto:sales@boxmoc.com" className="hover:underline">sales@boxmoc.com</a>
                                </p>
                            </address>
                        </div>
                         <div className="space-y-2">
                            <h3 className="font-semibold">France</h3>
                            <address className="not-italic text-muted-foreground space-y-2">
                                <p className="flex items-start gap-2">
                                    <MapPin className="h-5 w-5 mt-1 shrink-0" />
                                    <span>266 Place Ernest Granier<br/>34000 Montpellier<br/>France</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    <a href="tel:+33512182188" className="hover:underline">+33 5 12 18 21 88</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    <a href="mailto:sales.fr@boxmoc.com" className="hover:underline">sales.fr@boxmoc.com</a>
                                </p>
                            </address>
                        </div>
                    </div>
                </div>
                 <div className="space-y-4">
                     <h2 className="text-2xl font-bold font-headline">The Team</h2>
                    <Image 
                        src="https://picsum.photos/seed/office/600/400"
                        alt="Our team working in the office"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover"
                        data-ai-hint="office team collaboration"
                    />
                </div>
            </div>
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={formAction} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="Your Name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" name="company" placeholder="Your Company, Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="prompt" placeholder="Leave us a message..." rows={5} required minLength={10} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    <Send className="mr-2 h-4 w-4" />
                    {isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
