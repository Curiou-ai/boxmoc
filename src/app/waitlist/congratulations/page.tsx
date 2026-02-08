import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Box, CheckCircle, Twitter, Linkedin, Facebook } from "lucide-react"

export default function CongratulationsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center text-center p-4">
      <header className="absolute top-0 left-0 right-0 px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Boxmoc</span>
        </Link>
      </header>
      <main className="max-w-md mx-auto">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold tracking-tighter font-headline mb-4">
          You're on the list!
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Thank you for joining the waitlist. We're excited to have you on board. We'll send you an email as soon as we're ready to launch.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
        <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">Follow us for updates:</p>
            <div className="flex justify-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-6 w-6"/></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6"/></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6"/></Link>
            </div>
        </div>
      </main>
    </div>
  )
}
