
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Box, ArrowLeft } from "lucide-react"

export default function CookiePolicyPage() {
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
        <div className="container px-4 md:px-6 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">Cookie Policy</CardTitle>
                <CardDescription>Information about how we use cookies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>This is a placeholder page for our cookie policy. In a real application, this page would detail the types of cookies we use, why we use them, and how you can manage your preferences.</p>
                <p>Cookies are small text files stored on your device that help us improve your experience on our site. We use them for essential functionalities, performance analysis, and marketing purposes.</p>
                <h3 className="text-xl font-bold font-headline text-foreground pt-4">Your Choices</h3>
                <p>You can manage your cookie preferences at any time. Most web browsers allow you to control cookies through their settings. However, disabling certain cookies may affect the functionality of our website.</p>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
