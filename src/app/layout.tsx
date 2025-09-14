import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Chatbot } from '@/components/chatbot';
import { CookieBanner } from '@/components/cookie-banner';
import { AuthProvider } from '@/context/auth-context';
import { PageLoader } from '@/components/page-loader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Boxmoc',
  description: 'Create stunning designs for packaging, promotions, and events with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <AuthProvider>
          {children}
          <Chatbot />
          <CookieBanner />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
