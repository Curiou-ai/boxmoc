'use client';
import { useTransition } from 'react';
import { sendAccessCode } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export function SendAccessCodeButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      const result = await sendAccessCode(email);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        router.refresh(); // Refresh server component data
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} size="sm">
      {isPending ? 'Sending...' : <><Send className="mr-2 h-4 w-4" /> Send Code</>}
    </Button>
  );
}
