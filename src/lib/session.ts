import 'server-only';
import { cookies } from 'next/headers';
import { DecodedIdToken } from 'firebase-admin/auth';
import admin from './firebase-admin';

const db = admin.firestore();

// Define a shape for the user profile data stored in Firestore
export interface UserProfile {
  role: 'user' | 'admin';
  email: string;
  displayName: string;
  createdAt: string;
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

    // If a user has a valid auth session but no profile in Firestore, create one.
    // This handles users created via social login for the first time.
    if (!userDoc.exists) {
      const authUser = await admin.auth().getUser(decodedIdToken.uid);
      const newUserProfile: UserProfile = {
        email: authUser.email || '',
        displayName: authUser.displayName || 'New User',
        createdAt: new Date().toISOString(),
        role: 'user', // Default to 'user' role
      };
      await userDocRef.set(newUserProfile);
      
      // Return the newly created profile data combined with the token
      return { ...decodedIdToken, ...newUserProfile };
    }

    const userProfile = userDoc.data() as UserProfile;

    return { ...decodedIdToken, ...userProfile };

  } catch (error) {
    console.error('Error verifying session cookie or fetching user profile:', error);
    // Invalidate cookie if it's invalid to prevent redirect loops
    cookies().delete('session');
    return null;
  }
}
