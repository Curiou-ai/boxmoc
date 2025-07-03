
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container mx-auto flex h-12 max-w-7xl items-center justify-center gap-4 px-4 sm:px-6">
        <Sparkles className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium text-center">
          Boxmoc's biggest event of the year, Canvas '25 is coming{" "}
          <span className="font-bold">October 14, 2025</span> - Sign up to stay in the loop.
        </p>
        <Button
          asChild
          size="sm"
          className="shrink-0 bg-foreground text-background hover:bg-foreground/80 hidden sm:flex"
        >
          <Link href="#">Save the date</Link>
        </Button>
      </div>
    </div>
  );
}
