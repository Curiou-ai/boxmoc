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

// Function to check if all necessary keys are present and valid
const isConfigComplete = (config: any) => {
  return config && Object.values(config).every(value => value);
};


let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (process.env.NODE_ENV === 'production') {
  if (isConfigComplete(prodConfig)) {
    if (!getApps().length) {
      app = initializeApp(prodConfig);
    } else {
      app = getApps()[0];
    }
  } else {
    console.error("Production Firebase config is incomplete. App will not function correctly.");
  }
} else { // Development environment
  if (isConfigComplete(devConfig)) {
    if (!getApps().length) {
      app = initializeApp(devConfig);
    } else {
      app = getApps()[0];
    }
  } else {
    console.warn("Development Firebase config is incomplete. Running in offline mode.");
  }
}

if (app) {
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
