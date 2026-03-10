import 'server-only';
import { cookies } from 'next/headers';
import { DecodedIdToken } from 'firebase-admin/auth';
import admin from './firebase-admin';
import { stripe } from './stripe';

export interface UserProfile {
  role: 'user' | 'admin';
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: string;
  lastActiveAt?: string;
  status?: 'active' | 'churned' | 'onboarding' | 'trialing';
  notes?: Array<{ id: string; content: string; author: string; createdAt: string }>;
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
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(decodedIdToken.uid);
    const userDoc = await userDocRef.get();

    const now = new Date().toISOString();

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
        createdAt: now,
        lastActiveAt: now,
        role: 'user',
        status: 'onboarding',
        stripeCustomerId: stripeCustomer.id,
      };
      await userDocRef.set(newUserProfile);
      
      return { ...decodedIdToken, ...newUserProfile };
    }

    const userProfile = userDoc.data() as UserProfile;

    // Background update of lastActiveAt
    await userDocRef.update({ lastActiveAt: now });

    return { ...decodedIdToken, ...userProfile, lastActiveAt: now };

  } catch (error) {
    console.error('Error verifying session cookie or fetching user profile:', error);
    (await cookies()).delete('session');
    return null;
  }
}
