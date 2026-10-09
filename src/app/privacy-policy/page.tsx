import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Box, ArrowLeft, ShieldCheck } from "lucide-react"

export default function PrivacyPolicyPage() {
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
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Legal</span>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold font-headline mb-4">Privacy Policy</CardTitle>
              <CardDescription className="text-lg">Last Updated: {lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">1. Introduction</h2>
                <p>
                  Boxmoc ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-powered 3D design and packaging services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">2. Information We Collect</h2>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Personal Data</h3>
                  <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, including your email address, full name, and phone number.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Design Data</h3>
                  <p>We collect the parameters of the designs you create, including uploaded logos (.SVG), dimensions, and canvas coordinates, to provide our manufacturing and 3D preview services.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Payment Information</h3>
                  <p>We process payments through third-party services (Stripe and Shopify). We do not store or collect your payment card details. That information is provided directly to our third-party payment processors.</p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our Service, including monitoring usage.</li>
                  <li>To manage your Account and fulfill your custom orders.</li>
                  <li>To facilitate the manufacturing process through our supplier network.</li>
                  <li>To communicate with you regarding updates, security alerts, and support.</li>
                  <li>To comply with legal obligations (e.g., tax reporting).</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">4. Data Sharing & Third Parties</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Shopify:</strong> To handle the e-commerce checkout and order management.</li>
                  <li><strong>Stripe:</strong> To process secure subscription and one-time payments.</li>
                  <li><strong>Firebase:</strong> For authentication and secure data storage.</li>
                  <li><strong>Suppliers:</strong> Relevant design data is shared with manufacturers to fulfill your orders.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">5. Your Rights (GDPR & CCPA)</h2>
                <p>
                  Depending on your location, you have rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> You can request copies of your personal data.</li>
                  <li><strong>Rectification:</strong> You can request that we correct inaccurate information.</li>
                  <li><strong>Erasure:</strong> You can request that we delete your personal data under certain conditions.</li>
                  <li><strong>Opt-out:</strong> You can opt-out of the "sale" of personal information (though Boxmoc does not sell your data).</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">6. Security</h2>
                <p>
                  The security of your data is important to us. We use industry-standard encryption and security protocols (HTTPS, HMAC verification for webhooks, and Upstash rate-limiting) to protect your information.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-foreground">7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@boxmoc.com" className="text-primary hover:underline">privacy@boxmoc.com</a>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
