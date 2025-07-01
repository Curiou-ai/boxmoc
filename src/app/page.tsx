
import { ArrowRight, Box, BrainCircuit, Paintbrush, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import FeaturesTabs from '@/components/features-tabs'
import { ServicesAccordion } from '@/components/services-accordion'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed w-full border-b bg-background/95 backdrop-blur-sm z-20">
        <div className="container flex items-center h-14 max-w-7xl px-4 md:px-6">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Boxmoc</span>
          </Link>
          <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/creator">
                Start Designing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
          <div className="ml-auto md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium p-6">
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Box className="h-6 w-6 text-primary" />
                    <span className="font-bold">Boxmoc</span>
                  </Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Link>
                  <Button asChild className="mt-4">
                    <Link href="/creator">
                      Start Designing
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-14">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Design Your Perfect Box with AI
                </h1>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                  Bring your packaging ideas to life. Our intuitive tools and powerful AI make it easy to create stunning, custom box designs in minutes.
                </p>
              </div>
              <div className="w-full max-w-xs space-y-4">
                <form className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-11"
                    aria-label="Email"
                  />
                  <Button type="submit" asChild size="lg" className="w-full">
                    <Link href="/creator">
                      Get Started for Free
                    </Link>
                  </Button>
                </form>
              </div>
              <Image
                src="https://placehold.co/800x450.png"
                width="800"
                height="450"
                alt="Hero"
                data-ai-hint="packaging product mockup"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-contain sm:w-full max-w-4xl"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Better Way to Design</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  From first idea to final product, BoxCanvas streamlines your creative process. Explore the features that make designing effortless and fun.
                </p>
              </div>
              <div className="w-full max-w-5xl">
                <FeaturesTabs />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="p-1 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <div className="bg-card text-card-foreground rounded-xl p-8 md:p-12 lg:p-16">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
                      Supercharge Your Creativity with Boxmoc AI
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                      Let our AI be your co-designer. Instantly generate unique concepts, get smart suggestions, and refine your ideas in seconds. Go from a simple prompt to a production-ready design faster than ever before.
                    </p>
                    <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                      <Link href="/creator">Learn More</Link>
                    </Button>
                  </div>
                  <div>
                    <Image
                      src="https://placehold.co/600x450.png"
                      width="600"
                      height="450"
                      alt="AI Feature"
                      data-ai-hint="AI design tool"
                      className="rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              <div className="space-y-6 lg:w-1/2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                  The one place where all teams gather to build together
                </h2>
                <ServicesAccordion />
              </div>
              <div className="bg-accent/50 rounded-2xl p-4 md:p-6 lg:p-8 lg:w-1/2">
                  <Image
                    src="https://placehold.co/600x500.png"
                    width="600"
                    height="500"
                    alt="Design team collaborating"
                    data-ai-hint="design team collaboration"
                    className="rounded-xl shadow-2xl w-full h-full object-cover"
                  />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 max-w-7xl">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Create Your Masterpiece?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start designing your custom box today. It's free to get started.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/creator">
                  Start Designing Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full shrink-0 border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 max-w-7xl items-center px-4 md:px-6">
            <p className="text-xs text-muted-foreground text-center sm:text-left">&copy; 2024 Boxmoc. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link href="/contact" className="text-xs hover:underline underline-offset-4">
                Contact
              </Link>
              <Link href="#" className="text-xs hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs hover:underline underline-offset-4">
                Privacy
              </Link>
            </nav>
        </div>
      </footer>
    </div>
  )
}
