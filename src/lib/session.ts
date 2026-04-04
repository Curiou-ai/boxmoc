
import 'server-only';
import { cookies } from 'next/headers';
import { DecodedIdToken } from 'firebase-admin/auth';
import admin from './firebase-admin';
import { stripe } from './stripe';

/**
 * Defines the production-grade user profile structure.
 */
export interface UserProfile {
  role: 'user' | 'admin' | 'supplier' | 'logistics';
  tenantId: string; // Multi-tenant isolation identifier
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: string;
  lastActiveAt?: string;
  status?: 'active' | 'churned' | 'onboarding' | 'trialing';
  notes?: Array<{ id: string; content: string; author: string; createdAt: string }>;
  // Stripe integration
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: number;
  stripeSubscriptionStatus?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid';
}

export type UserSession = DecodedIdToken & UserProfile;

export async function getSession(): Promise<UserSession | null> {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;

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
        metadata: { firebaseUID: decodedIdToken.uid },
      });
      
      const newUserProfile: UserProfile = {
        email: authUser.email || '',
        displayName: authUser.displayName || 'New User',
        photoURL: authUser.photoURL || null,
        createdAt: now,
        lastActiveAt: now,
        role: 'user',
        tenantId: `tenant_${decodedIdToken.uid}`, // Default to individual tenant
        status: 'onboarding',
        stripeCustomerId: stripeCustomer.id,
      };
      
      await userDocRef.set(newUserProfile);
      return { ...decodedIdToken, ...newUserProfile };
    }

    const userProfile = userDoc.data() as UserProfile;
    await userDocRef.update({ lastActiveAt: now });

    return { ...decodedIdToken, ...userProfile, lastActiveAt: now };

  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}
