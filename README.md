
# Boxmoc - AI Design Platform

This is a Next.js application integrated with Firebase, designed for AI-powered packaging and marketing material creation.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

To get started, take a look at src/app/page.tsx

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

To fully integrate this app with a live database, follow these steps in the [Firebase Console](https://console.firebase.google.com/):

1.  **Create a Project**: Click "Add Project" and follow the wizard.
2.  **Enable Firestore**: Go to **Build > Firestore Database** and click **Create Database**. Start in "Production Mode" but ensure your location is close to your users.
3.  **Register Web App**: On the Project Overview page, click the `</>` icon. Register your app (e.g., "Boxmoc-Web") and copy the `firebaseConfig` object.
4.  **Service Account (for Server-side)**:
    *   Go to **Project Settings > Service Accounts**.
    *   Click **Generate New Private Key**. This downloads a JSON file.
    *   You will need the `client_email` and `private_key` from this file for your `.env` variables.


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
    *   Create a `.env.local` file in the root of your Next.js project and populate it with the following keys (using the data from the steps above):
    *   Paste your `firebaseConfig` credentials into this file, prefixing each key with `NEXT_PUBLIC_`. This makes them available on both the client and server sides.
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

    # Server-side (Private)
    FIREBASE_CLIENT_EMAIL="..."
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

    # API Configuration
    COMPANY_EMAIL="your-admin@example.com"
    RESEND_API_KEY="re_...
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


## Security Measures for Your Platform
1. XSS - Prevent injection of javascript code from user input
2. SQL injection - Prevent SQL Injections into databases or api requests
3. CORS - Ensure secruity measures for CORS
4. CSRF (Cross-Site Request Forgery) Establish mitigation strategies for CSRF (Cross-Site Request Forgery)

## 🏗️ Architecture

*   **Database**: This app uses **Cloud Firestore** (NoSQL). It does not require traditional SQL migrations.
*   **Authentication**: Integrated with Firebase Auth (Email/Password, Google, and Phone).
*   **Storage**: Firebase Storage is used for high-resolution design uploads.
*   **AI**: Powered by Genkit and Google Gemini for design generation and chatbot support.

## 🔒 Security & Environment Variables

To run this project securely, ensure your `.env.local` file is configured correctly. Never expose private keys with the `NEXT_PUBLIC_` prefix.

### Public (Client-side) Variables
Prefix these with `NEXT_PUBLIC_` to make them available to the browser.
```env
NEXT_PUBLIC_APP_NAME="Boxmoc"
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
```

### Private (Server-side) Variables
Sensitive keys MUST NOT have the `NEXT_PUBLIC_` prefix.
```env
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
RESEND_API_KEY="..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```
