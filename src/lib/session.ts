
import 'server-only';
import { cookies } from 'next/headers';
import { DecodedIdToken } from 'firebase-admin/auth';
import admin from './firebase-admin';
import { stripe } from './stripe';

const db = admin.firestore();

export interface UserProfile {
  role: 'user' | 'admin';
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: string;
  // Stripe fields
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: number; // Store as Unix timestamp
  stripeSubscriptionStatus?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid';
}

// The session object will include both Auth data and Firestore profile data
export type UserSession = DecodedIdToken & UserProfile;

export async function getSession(): Promise<UserSession | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    const userDocRef = db.collection('users').doc(decodedIdToken.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      const authUser = await admin.auth().getUser(decodedIdToken.uid);
      
      const stripeCustomer = await stripe.customers.create({
        email: authUser.email,
        name: authUser.displayName,
        metadata: {
          firebaseUID: decodedIdToken.uid,
        },
      });
      
      const newUserProfile: UserProfile = {
        email: authUser.email || '',
        displayName: authUser.displayName || 'New User',
        photoURL: authUser.photoURL || null,
        createdAt: new Date().toISOString(),
        role: 'user',
        stripeCustomerId: stripeCustomer.id,
      };
      await userDocRef.set(newUserProfile);
      
      return { ...decodedIdToken, ...newUserProfile };
    }

    const userProfile = userDoc.data() as UserProfile;

    return { ...decodedIdToken, ...userProfile };

  } catch (error) {
    console.error('Error verifying session cookie or fetching user profile:', error);
    cookies().delete('session');
    return null;
  }
}
