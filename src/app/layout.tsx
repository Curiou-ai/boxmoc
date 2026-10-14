import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Chatbot } from '@/components/chatbot';
import { CookieBanner } from '@/components/cookie-banner';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { PageLoader } from '@/components/page-loader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://boxmoc.com'),
  title: {
    default: 'Boxmoc | AI-Powered 3D Packaging Design',
    template: '%s | Boxmoc'
  },
  description: 'Create custom printed packages with the power of AI and real-time 3D previews. Professional packaging simplified.',
  keywords: ['3D packaging', 'AI design', 'custom boxes', 'SME branding', 'event promotions', '3D printing'],
  authors: [{ name: 'Boxmoc Team' }],
  creator: 'Boxmoc',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://boxmoc.com',
    siteName: 'Boxmoc',
    title: 'Boxmoc | AI-Powered 3D Packaging Design',
    description: 'Design and order custom packaging in minutes with our AI-driven 3D studio.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Boxmoc 3D Design Studio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boxmoc | AI-Powered 3D Packaging Design',
    description: 'Design and order custom packaging in minutes with our AI-driven 3D studio.',
    images: ['/og-image.png'],
    creator: '@boxmoc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#445544',
  width: 'device-width',
  initialScale: 1,
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
          <CartProvider>
            {children}
            <Chatbot />
            <CookieBanner />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
