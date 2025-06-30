
import { ArrowRight, Box, BrainCircuit, Paintbrush, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed w-full border-b bg-background/95 backdrop-blur-sm z-20">
        <div className="container flex items-center h-14 max-w-7xl px-4 md:px-6">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">BoxCanvas</span>
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
                    <span className="font-bold">BoxCanvas</span>
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
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col gap-2">
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
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Unleash Your Creativity</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is packed with features to help you design the perfect packaging for your product.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-1 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-4 text-center items-start">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <BrainCircuit className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">AI-Powered Generation</h3>
                <p className="text-muted-foreground">Describe your vision and let our AI generate unique design concepts in seconds. No design skills required.</p>
              </div>
              <div className="grid gap-4 text-center items-start">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <Box className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Interactive 3D Preview</h3>
                <p className="text-muted-foreground">See your design from every angle with our real-time 3D preview. Ensure it's perfect before you finalize.</p>
              </div>
              <div className="grid gap-4 text-center items-start">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <Paintbrush className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Easy Customization</h3>
                <p className="text-muted-foreground">Fine-tune every detail. Upload your own assets, add text, and use our design tools for full control.</p>
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
            <p className="text-xs text-muted-foreground text-center sm:text-left">&copy; 2024 BoxCanvas. All rights reserved.</p>
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
