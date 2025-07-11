
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { Box, Phone, ArrowLeft, MapPin } from "lucide-react"

export default function ContactPage() {
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
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Talk to our product analytics expert</h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mt-4">
                        Have questions about pricing, plans, or Boxmoc? Fill out the form and our product analytics expert will be in touch directly.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline">Our office</h2>
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="Our team working in the office"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover"
                        data-ai-hint="office team collaboration"
                    />
                    <p className="text-muted-foreground">
                        Have questions about pricing, plans, or Boxmoc? Fill out the form and our product analytics expert will be in touch directly.
                    </p>
                </div>
                
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
                        </address>
                    </div>
                </div>
            </div>
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="First Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Last Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Email Address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Company Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Phone Number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Leave us a message..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
