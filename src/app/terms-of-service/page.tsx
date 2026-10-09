import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Box, ArrowLeft, Gavel } from "lucide-react"

export default function TermsOfServicePage() {
  const lastUpdated = "May 20, 2024";

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">Boxmoc</span>
        </Link>
        <nav className="ml-auto">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </nav>
      </header>
      <main className="py-12 md:py-24">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Gavel className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Agreement</span>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold font-headline mb-4">Terms of Service</CardTitle>
              <CardDescription className="text-lg">Last Updated: {lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Boxmoc ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">2. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">3. Intellectual Property & Designs</h2>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">User Content</h3>
                  <p>You retain all your ownership rights to the logos and artwork you upload to Boxmoc. By using our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your designs solely for the purpose of fulfilling your manufacturing and printing requests.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Prohibited Content</h3>
                  <p>You agree not to upload designs that are illegal, infringing on third-party trademarks/copyrights, or otherwise harmful.</p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">4. Payments and Billing</h2>
                <p>
                  All payments are processed securely through Shopify and Stripe. By placing an order, you agree to pay the fees associated with your selection. For subscription plans, you will be billed on a recurring basis as per your choice. All sales of custom-manufactured goods are final unless there is a material defect in production.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">5. Custom Manufacturing & Shipping</h2>
                <p>
                  Boxmoc acts as a design and supply chain orchestrator. While we strive for 99% design accuracy, minor variations in color and material texture may occur due to the nature of custom printing and 3D manufacturing. Shipping timelines are estimates and not guarantees.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">6. Limitation of Liability</h2>
                <p>
                  In no event shall Boxmoc, nor its directors, employees, partners, or suppliers, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses, resulting from your access to or use of the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">7. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of Oregon, United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">8. Changes</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
