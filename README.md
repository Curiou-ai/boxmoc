
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploy to GitHub from IDX

<b><u>Email address privacy settings</u></b>
Amend your commits to use a no-reply GitHub email You can also amend your local commits to use the GitHub-provided no-reply email address. This way, you don't have to change your GitHub settings. The format of this email is typically

git config user.email "your-username@users.noreply.github.com"

git commit --amend --reset-author


## Deploying Next.js to Vercel with a Firebase Database


This guide will walk you through the process of deploying a Next.js project to Vercel and integrating it with a Firebase database.

### Prerequisites

*   A Next.js project
*   A Vercel account
*   A Firebase account

### Step 1: Set up your Firebase project

1.  **Create a new Firebase project**:
    *   Go to the [Firebase console](https://console.firebase.google.com/).
    *   Click **Add project** and follow the setup wizard to create your project.
2.  **Create a database**:
    *   In the Firebase console, go to **Build > Firestore Database** or **Realtime Database**. Firestore is generally recommended for new projects.
    *   Click **Create database** and choose your starting mode (e.g., test mode for development).
3.  **Register a web app**:
    *   On your project overview page, click the **Web icon** (`</>`) to create a new web app.
    *   Copy the `firebaseConfig` object provided after registration. You will need this for your Next.js project.

### Step 2: Integrate Firebase into your Next.js app

1.  **Install the Firebase SDK**:
    ```sh
    npm install firebase
    # or
    yarn add firebase
    ```
2.  **Add environment variables**:
    *   Create a `.env.local` file in the root of your Next.js project.
    *   Paste your `firebaseConfig` credentials into this file, prefixing each key with `NEXT_PUBLIC_`. This makes them available on both the client and server sides.
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
    ```
3.  **Initialize Firebase**:
    *   Create a file, such as `lib/firebase.js` or `lib/firebase.ts`.
    *   Add the following code to initialize the Firebase app and export the database instance:
    ```js
    // lib/firebase.js
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    ```
4.  **Use Firebase in your components**:
    *   You can now import the `db` instance to interact with your database. Remember to add `'use client';` for client-side components.
    ```jsx
    // app/page.jsx
    'use client';
    import { db } from '../lib/firebase';
    import { collection, getDocs } from 'firebase/firestore';

    async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "your_collection"));
    const data = querySnapshot.docs.map(doc => doc.data());
    console.log(data);
    }
    ```

## Step 3: Secure your app and environment variables

1.  **Configure Firebase security rules**:
    *   In the Firebase console, go to **Firestore Database > Rules** and update your rules to protect your data. For production, restrict public read/write access.
2.  **Add environment variables to Vercel**:
    *   Go to your Vercel dashboard and navigate to **Project > Settings > Environment Variables**.
    *   Add each key-value pair from your `.env.local` file here.
3.  **Add Vercel domain to Firebase (for authentication)**:
    *   If using Firebase Authentication, add your Vercel deployment domain (e.g., `your-project.vercel.app`) to the **Authentication > Settings > Authorized Domains** list in the Firebase console.

## Step 4: Deploy to Vercel

1.  **Connect your Git repository**:
    *   Push your Next.js project to a Git repository (e.g., GitHub).
    *   In your Vercel dashboard, click **Add New > Project**, select your repository, and click **Import**.
2.  **Deploy**:
    *   Vercel will automatically detect the Next.js project and begin deployment.                
    *   Once deployed, you can visit your app at the provided Vercel URL.