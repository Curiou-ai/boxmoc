'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleRequestHelp, HelpFormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LifeBuoy } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Submitting...' : <> <LifeBuoy className="mr-2 h-4 w-4" /> Submit Request </>}
    </Button>
  );
}

export default function RequestHelpForm({ onSubmitted }: { onSubmitted: () => void }) {
  const initialState: HelpFormState = { message: '' };
  const [state, formAction] = useFormState(handleRequestHelp, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Request Sent!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        onSubmitted();
      }
    }
  }, [state, onSubmitted, toast]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" name="name" placeholder="Jane Doe" required defaultValue={state.fields?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Your Email</Label>
          <Input id="email" name="email" type="email" placeholder="jane@example.com" required defaultValue={state.fields?.email} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="design-prompt">Design Prompt</Label>
        <Textarea
          id="design-prompt"
          name="prompt"
          placeholder="Describe your box idea. You can copy your prompt from the AI generator here."
          rows={4}
          required
          defaultValue={state.fields?.prompt}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any other details for our design team?"
          rows={3}
          defaultValue={state.fields?.notes}
        />
      </div>
      {state.message && !state.success && (
        <p className="text-sm text-destructive mt-1">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}
