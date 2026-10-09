'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cookie, ShieldAlert } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (!cookieConsent) {
      setShowBanner(true);
      // In a real production environment, non-essential scripts 
      // (GTM, Pixel, etc.) should be blocked here until handleAccept is called.
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
    // Logic to initialize tracking scripts after consent goes here
    window.location.reload(); // Optional: reload to trigger script initialization
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-card/98 backdrop-blur-md z-[100] border-t border-primary/10 animate-in slide-in-from-bottom-5">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 text-center lg:text-left max-w-2xl">
            <div className="p-2 bg-primary/10 rounded-full shrink-0 hidden sm:block">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground flex items-center justify-center lg:justify-start gap-2">
                Your Privacy Matters (GDPR & CCPA Compliant)
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use essential cookies to make our platform work and optional analytics cookies to improve your 3D design experience. 
                <span className="font-semibold text-foreground"> Non-essential tracking is disabled by default until you accept.</span> 
                Learn more in our{" "}
                <Link href="/privacy-policy" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Button onClick={handleAccept} className="sm:px-8 font-bold">Accept All</Button>
            <Button variant="outline" onClick={handleDecline} className="sm:px-8 font-bold">Essential Only</Button>
            <Button variant="ghost" asChild className="text-xs text-muted-foreground">
              <Link href="/cookie-policy">Preferences</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
