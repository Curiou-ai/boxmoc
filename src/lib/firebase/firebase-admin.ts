import admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      // The DECODER routines::unsupported error is often caused by 
      // improperly formatted private keys in environment variables.
      // We ensure newlines are correctly interpreted.
      const formattedKey = privateKey.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
        storageBucket: `${projectId}.appspot.com`,
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Firebase Admin credentials missing. Server-side Firebase features will be unavailable.');
    }
  }
}

export default admin;
