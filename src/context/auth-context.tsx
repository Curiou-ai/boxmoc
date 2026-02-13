
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

// Extend the User type to include our custom profile fields
export interface AppUser extends User, DocumentData {
  role?: 'user' | 'admin';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: number;
  stripeSubscriptionStatus?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const mockUser: AppUser = {
  uid: 'dev-user-123',
  displayName: 'Dev User',
  email: 'dev@example.com',
  photoURL: 'https://placehold.co/48x48.png',
  role: 'user',
  stripeSubscriptionStatus: 'active',
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
} as AppUser;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeProfile: () => void;

    if (auth && db) {
      unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Listen for profile changes in Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const profileData = doc.data();
              setUser({ ...firebaseUser, ...profileData });
            } else {
               // This can happen briefly if the user doc hasn't been created yet.
               // We fallback to the firebase user, and Firestore will sync up shortly.
               setUser(firebaseUser as AppUser);
            }
            setLoading(false);
          }, (error) => {
            console.error("Error fetching user profile:", error);
            setUser(firebaseUser as AppUser); // Fallback to just firebase user
            setLoading(false);
          });
        } else {
          setUser(null);
          setLoading(false);
        }
      });
    } else { // Firebase is not configured, likely in dev offline mode
      setUser(mockUser);
      setLoading(false);
    }
    
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signOut = async () => {
    // If in dev and offline, just clear the mock user
    if (process.env.NODE_ENV === 'development' && !auth) {
      setUser(null);
      router.push('/login');
      return;
    }
    
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      <div id="recaptcha-container"></div>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
