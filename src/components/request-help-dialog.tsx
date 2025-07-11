
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import RequestHelpForm from './request-help-form';

export default function RequestHelpDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
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
