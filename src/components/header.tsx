
import { Package, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
      <Link href="/" className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold font-headline text-foreground">BoxCanvas</h1>
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
        <Button>
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Avatar className="ml-2">
          <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="avatar person" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
