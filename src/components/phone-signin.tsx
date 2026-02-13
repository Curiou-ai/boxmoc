
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Smartphone } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function PhoneSignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only configure reCAPTCHA in production and if Firebase is available
    if (process.env.NODE_ENV === 'production' && auth) {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved.
                },
            });
        }
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast({ title: 'Error', description: 'Please enter a phone number.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    
    if (!auth) {
        // If firebase is not configured, handle based on environment
        if (process.env.NODE_ENV === 'production') {
            toast({ title: 'Error', description: 'Phone sign-in is currently unavailable.', variant: 'destructive' });
            setIsSubmitting(false);
            return;
        } else {
            // In development, simulate the OTP flow
            console.warn("Firebase not configured. Simulating phone auth.");
            console.log(`DEV MODE: Simulating OTP sent to ${phoneNumber}`);
            toast({ title: 'DEV MODE', description: 'OTP sent! Use any 6 digits to proceed.' });
            setStep('otp');
            setIsSubmitting(false);
            return;
        }
    }
    
    // This block runs only if auth is available.
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      toast({ title: 'OTP Sent!', description: 'Please check your phone for the verification code.' });
      setStep('otp');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({ title: 'Error', description: `Failed to send OTP: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({ title: 'Error', description: 'Please enter a valid 6-digit OTP.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    
    if (!auth) {
        if (process.env.NODE_ENV === 'production') {
             // This case should ideally not be reachable if sendOtp is handled correctly
             toast({ title: 'Error', description: 'Phone sign-in is currently unavailable.', variant: 'destructive' });
             setIsSubmitting(false);
             return;
        } else {
            // In development, simulate successful login
            console.warn("Firebase not configured. Simulating OTP verification.");
            console.log(`DEV MODE: Simulating OTP verification with ${otp}`);
            toast({ title: 'DEV MODE', description: 'Login successful!' });
            router.push('/creator');
            // No finally block needed here, as we return
            return;
        }
    }

    try {
      if (window.confirmationResult) {
        const userCredential = await window.confirmationResult.confirm(otp);
        const idToken = await userCredential.user.getIdToken();

        await fetch('/api/auth/session-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        toast({ title: 'Success!', description: 'You are now signed in.' });
        router.push('/creator');
      } else {
        throw new Error('Confirmation result not found. Please try sending the code again.');
      }
    } catch (error: any)
    {
      console.error('Error verifying OTP:', error);
      toast({ title: 'Error', description: `Failed to verify OTP: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (step === 'otp') {
    return (
      <div className="space-y-4">
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          disabled={isSubmitting}
        />
        <Button onClick={handleVerifyOtp} disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
        </Button>
        <Button variant="link" size="sm" onClick={() => { setStep('phone'); setOtp(''); }} className="w-full">
          Back to phone number
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.g.target.value)}
          placeholder="e.g. +14155552671"
          disabled={isSubmitting}
        />
        <Button onClick={handleSendOtp} disabled={isSubmitting} variant="outline">
          <Smartphone className="h-5 w-5 mr-2" />
          {isSubmitting ? 'Sending...' : 'Use Phone'}
        </Button>
    </div>
  );
}
