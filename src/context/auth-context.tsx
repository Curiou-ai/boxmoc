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

    if (auth && db) {
      unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        if (unsubscribeProfile) unsubscribeProfile();

        if (firebaseUser) {
          // Real-time listener to Firestore user document for roles and metadata
          const userDocRef = doc(db, 'users', firebaseUser.uid);
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
            console.error("Firestore Profile Sync Error:", error);
            setUser(firebaseUser as AppUser);
            setLoading(false);
          });
        } else {
          setUser(null);
          setLoading(false);
        }
      });
    } else {
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
    if (process.env.NODE_ENV === 'development' && !auth) {
      setUser(null);
      router.push('/login');
      return;
    }
    
    try {
      if (auth) await firebaseSignOut(auth);
      // Ensure server-side session cookie is also cleared
      await fetch('/api/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Sign-out error:", error);
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
