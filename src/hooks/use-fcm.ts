
'use client';

import { useEffect, useState } from 'react';
import { getMessagingInstance } from '@/lib/firebase';
import { getToken, onMessage, type Messaging } from 'firebase/messaging';
import { useToast } from './use-toast';

/**
 * Hook to manage Firebase Cloud Messaging permissions and real-time updates.
 */
export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getMessagingInstance().then(setMessaging);
  }, []);

  useEffect(() => {
    if (!messaging) return;

    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const fcmToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          
          if (fcmToken) {
            setToken(fcmToken);
            // In a production app, you would save this token to the user document
            // console.log('SaaS Registration Token:', fcmToken);
          }
        }
      } catch (error) {
        console.error('FCM Setup Failed:', error);
      }
    };

    setupFCM();

    // Foreground listener for real-time order updates
    const unsubscribe = onMessage(messaging, (payload) => {
      toast({
        title: payload.notification?.title || 'Order Update',
        description: payload.notification?.body || 'Your shipment status has changed.',
      });
    });

    return () => unsubscribe();
  }, [messaging, toast]);

  return { token, isSupported: !!messaging };
}
