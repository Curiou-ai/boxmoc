'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // We need to wait for the component to mount to access localStorage
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-card/95 backdrop-blur-sm z-50 border-t animate-in slide-in-from-bottom-5">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Cookie className="h-6 w-6 text-primary shrink-0 hidden sm:block" />
            <p className="text-sm text-foreground">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button onClick={handleAccept}>Accept</Button>
            <Button variant="secondary" asChild>
              <Link href="/cookie-policy">Preferences</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
