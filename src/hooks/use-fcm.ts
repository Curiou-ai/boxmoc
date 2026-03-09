'use client';

import { useEffect, useState } from 'react';
import { getMessagingInstance } from '@/lib/firebase';
import { getToken, onMessage, type Messaging } from 'firebase/messaging';
import { useToast } from './use-toast';

/**
 * Hook to manage Firebase Cloud Messaging permissions, tokens, and messages.
 * Requires NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local
 */
export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Messaging can only be initialized on the client
    getMessagingInstance().then(setMessaging);
  }, []);

  useEffect(() => {
    if (!messaging) return;

    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // vapidKey is required to generate the registration token
          const fcmToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          
          if (fcmToken) {
            setToken(fcmToken);
            // Note: You should save this token to your user's document in Firestore 
            // to target notifications to them from the backend.
            console.log('FCM Token Generated:', fcmToken);
          }
        }
      } catch (error) {
        console.error('Failed to setup FCM:', error);
      }
    };

    setupFCM();

    // Listen for messages while the app is in the foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      toast({
        title: payload.notification?.title || 'New Notification',
        description: payload.notification?.body || '',
      });
    });

    return () => unsubscribe();
  }, [messaging, toast]);

  return { token, isSupported: !!messaging };
}
