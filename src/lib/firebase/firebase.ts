
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const prodConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const devConfig = {
  apiKey: process.env.NEXT_PUBLIC_DEV_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DEV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DEV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DEV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DEV_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DEV_FIREBASE_APP_ID,
};

const isConfigComplete = (config: any) => {
  return config && Object.values(config).every(value => value);
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (process.env.NODE_ENV === 'production') {
  if (isConfigComplete(prodConfig)) {
    app = !getApps().length ? initializeApp(prodConfig) : getApps()[0];
  }
} else {
  if (isConfigComplete(devConfig)) {
    app = !getApps().length ? initializeApp(devConfig) : getApps()[0];
  }
}

if (app) {
  auth = getAuth(app);
  db = getFirestore(app);
}

export const getMessagingInstance = async () => {
  if (typeof window === 'undefined' || !app) return null;
  try {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    if (await isSupported()) {
      return getMessaging(app);
    }
  } catch (e) {
    return null;
  }
  return null;
};

export { app, auth, db };
