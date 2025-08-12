
'use client';
import { useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebase';

export default function GoogleAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const idToken = await user.getIdToken();
        
        // Send the token to your server to create a session cookie
        await fetch('/api/auth/session-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        router.push('/creator');
      })
      .catch((error) => {
        console.error("Google Sign-In Error: ", error);
        router.push('/login?error=' + encodeURIComponent(error.message));
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p>Redirecting to Google Sign-In...</p>
    </div>
  );
}
