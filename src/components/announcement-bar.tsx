
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container mx-auto flex h-12 max-w-7xl items-center justify-center gap-4 p-4 sm:p-6">
        <Sparkles className="h-5 w-5 shrink-0" />
        <p className="sm:text-sm text-xs font-medium text-center">
          Boxmoc's beta is coming soon. Click here to be added on the waitlist{" "}
          {/*<span className="font-bold">October 21st, 2026</span>*/}
        </p>
        <Button
          asChild
          size="sm"
          className="shrink-0 bg-foreground text-background hover:bg-foreground/80 hidden sm:flex"
        >
          <Link href="#">Join Waitlist</Link>
        </Button>
      </div>
    </div>
  );
}
