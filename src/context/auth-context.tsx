'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

/**
 * Extended User interface that includes Firestore profile data and roles.
 */
export interface AppUser extends User, DocumentData {
  role?: 'user' | 'admin';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: number;
  stripeSubscriptionStatus?: string;
  status?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

/**
 * Mock user used for offline development when Firebase is not configured.
 */
const mockUser: AppUser = {
  uid: 'dev-user-123',
  displayName: 'Dev User',
  email: 'dev@example.com',
  photoURL: 'https://placehold.co/48x48.png',
  role: 'user', // Default dev role
  stripeCustomerId: 'cus_dev123',
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  stripeSubscriptionStatus: 'active',
  stripeCurrentPeriodEnd: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
} as AppUser;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribeAuth: () => void = () => {};
    let unsubscribeProfile: () => void = () => {};

    // Create stable local references to satisfy TypeScript refinement in callbacks
    const currentAuth = auth;
    const currentDb = db;

    if (currentAuth && currentDb) {
      unsubscribeAuth = onAuthStateChanged(currentAuth, (firebaseUser) => {
        if (unsubscribeProfile) unsubscribeProfile(); // Unsubscribe from previous profile listener

        if (firebaseUser) {
          // Real-time listener to Firestore user document for roles and metadata
          const userDocRef = doc(currentDb, 'users', firebaseUser.uid);
          unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const profileData = doc.data();
              setUser({ ...firebaseUser, ...profileData } as AppUser);
            } else {
               // Fallback if document is still being created
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
      // Development offline mode
      setUser(mockUser);
      setLoading(false);
    }
    
    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const signOut = async () => {
    const currentAuth = auth;
    // If in dev and offline, just clear the mock user
    if (process.env.NODE_ENV === 'development' && !currentAuth) {
      setUser(null);
      router.push('/login');
      return;
    }
    
    try {
      if (currentAuth) await firebaseSignOut(currentAuth);
      // Session cookie is HTTP-only, needs to be cleared by server
      await fetch('/api/auth/logout');
      setUser(null);
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
