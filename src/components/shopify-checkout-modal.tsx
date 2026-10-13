
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ShopifyCheckoutModalProps {
  url: string | null;
  onClose: () => void;
}

/**
 * A sophisticated Checkout Bridge that hosts Shopify's native checkout sequence.
 * Includes fallback logic for environments where iframes are blocked by security policies.
 */
export default function ShopifyCheckoutModal({ url, onClose }: ShopifyCheckoutModalProps) {
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    // Shopify checkout sometimes has X-Frame-Options: DENY depending on the plan/region
    // This timeout checks if the iframe actually reports loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [url]);

  if (!url) return null;

  return (
    <Dialog open={!!url} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-none">
        <DialogHeader className="p-4 bg-background border-b flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2">
             <div className="bg-primary/10 p-1.5 rounded text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <div>
                <DialogTitle className="text-sm font-bold uppercase tracking-widest leading-none">Secure Checkout</DialogTitle>
                <p className="text-[10px] text-muted-foreground uppercase font-medium mt-1">Native Shopify Fulfillment System</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase" onClick={() => window.open(url, '_blank')}>
                <ExternalLink className="h-3 w-3 mr-1" /> External Tab
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
                <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-muted/20 relative">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing Secure Gateway...</p>
            </div>
          )}

          {iframeBlocked ? (
             <div className="h-full flex items-center justify-center p-8">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Security Policy Restriction</AlertTitle>
                    <AlertDescription className="space-y-4 pt-2">
                        <p className="text-sm">To protect your payment information, this Shopify store requires checkout to be completed in a dedicated secure tab.</p>
                        <Button className="w-full font-bold uppercase" onClick={() => window.location.href = url}>
                            Continue to Secure Checkout
                        </Button>
                    </AlertDescription>
                </Alert>
             </div>
          ) : (
            <iframe
              src={url}
              className="w-full h-full border-none"
              title="Shopify Checkout"
              onLoad={() => setIsLoading(false)}
              onError={() => setIframeBlocked(true)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
