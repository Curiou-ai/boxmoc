'use client';

import { useEffect, useActionState } from 'react';
import { /*useFormState,*/ useFormStatus } from 'react-dom';
import { handleGenerateDesign, FormState } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface AiDesignFormProps {
  onDesignGenerated: (design: { imageUrl: string; description: string }) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating...' : <> <Sparkles className="mr-2 h-4 w-4" /> Generate Design </>}
    </Button>
  );
}

export default function AiDesignForm({ onDesignGenerated }: AiDesignFormProps) {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(handleGenerateDesign, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.design) {
        toast({
          title: "Success!",
          description: state.message,
        });
        onDesignGenerated({ imageUrl: state.design.imageUrl, description: state.design.designDescription });
      } else {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, onDesignGenerated, toast]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="prompt" className="font-semibold">Design Prompt</Label>
        <Textarea
          id="prompt"
          name="prompt"
          placeholder="e.g., a floral thank you card for a wedding, or a sleek, minimalist black box for a luxury watch"
          rows={5}
          required
          defaultValue={state.fields?.prompt}
          aria-describedby="prompt-error"
          className="mt-1"
        />
        {state.message && !state.design && (
          <p id="prompt-error" className="text-sm text-destructive mt-1">{state.message}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
