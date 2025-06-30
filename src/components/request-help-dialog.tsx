'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import RequestHelpForm from './request-help-form';
import { Users } from 'lucide-react';

export default function RequestHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          <Users className="mr-2 h-4 w-4" /> Request Help from Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Get Expert Design Assistance</DialogTitle>
          <DialogDescription>
            Fill out the form below to connect with our professional design team. They'll help you perfect your concept or take over from here.
          </DialogDescription>
        </DialogHeader>
        <RequestHelpForm onSubmitted={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
