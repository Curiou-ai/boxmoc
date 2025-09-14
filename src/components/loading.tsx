
'use client';

import { Box } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse">
        <Box className="h-16 w-16 text-primary" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading Boxmoc...</p>
    </div>
  );
}
