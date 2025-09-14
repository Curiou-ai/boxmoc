
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const mockUser = {
  uid: 'dev-user-123',
  displayName: 'Dev User',
  email: 'dev@example.com',
  photoURL: 'https://placehold.co/48x48.png',
} as User;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In production, always use real Firebase auth
    if (process.env.NODE_ENV === 'production' && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } 
    // In development, check if auth is configured
    else if (process.env.NODE_ENV === 'development') {
      if (auth) { // Firebase is configured, use real auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
      } else { // Firebase is not configured, use mock user
        setUser(mockUser);
        setLoading(false);
      }
    } else {
       // In any other case (or if auth is null), stop loading
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    // If in dev and offline, just clear the mock user
    if (process.env.NODE_ENV === 'development' && !auth) {
      setUser(null);
      router.push('/login');
      return;
    }
    
    // Otherwise, use real Firebase sign out
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Show loading skeleton while checking auth status
  if (loading) {
    return (
        <div className="flex flex-col space-y-3 p-4">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
    );
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
