import 'server-only';
import { cookies } from 'next/headers';
import { DecodedIdToken } from 'firebase-admin/auth';
import admin from './firebase-admin';
import { stripe } from './stripe';

/**
 * Defines the user profile structure stored in Firestore.
 */
export interface UserProfile {
  role: 'user' | 'admin';
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: string;
  lastActiveAt?: string;
  status?: 'active' | 'churned' | 'onboarding' | 'trialing';
  notes?: Array<{ id: string; content: string; author: string; createdAt: string }>;
  // Stripe integration fields
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: number; // Unix timestamp
  stripeSubscriptionStatus?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid';
}

/**
 * Combined session object including Auth token data and Firestore profile data.
 */
export type UserSession = DecodedIdToken & UserProfile;

/**
 * Retrieves and validates the current user session from the request cookies.
 * Also synchronizes/lazy-initializes the user profile in Firestore.
 */
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

    // Lazy-initialize user document if it doesn't exist (e.g., first-time Google sign-in)
    if (!userDoc.exists) {
      const authUser = await admin.auth().getUser(decodedIdToken.uid);
      
      // Initialize Stripe Customer
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
        role: 'user', // Default role for all new signups
        status: 'onboarding',
        stripeCustomerId: stripeCustomer.id,
      };
      
      await userDocRef.set(newUserProfile);
      return { ...decodedIdToken, ...newUserProfile };
    }

    const userProfile = userDoc.data() as UserProfile;

    // Background update of lastActiveAt for usage velocity tracking
    await userDocRef.update({ lastActiveAt: now });

    return { ...decodedIdToken, ...userProfile, lastActiveAt: now };

  } catch (error) {
    console.error('Session validation error:', error);
    // Delete invalid session cookie
    (await cookies()).delete('session');
    return null;
  }
}
