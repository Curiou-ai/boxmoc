
# Boxmoc - AI Design Platform

This is a Next.js application integrated with Firebase, designed for AI-powered packaging and marketing material creation.

## 🚀 Getting Started

### 1. Firebase Project Setup
To fully integrate this app with a live database, follow these steps in the [Firebase Console](https://console.firebase.google.com/):

1.  **Create a Project**: Click "Add Project" and follow the wizard.
2.  **Enable Firestore**: Go to **Build > Firestore Database** and click **Create Database**. Start in "Production Mode" but ensure your location is close to your users.
3.  **Register Web App**: On the Project Overview page, click the `</>` icon. Register your app (e.g., "Boxmoc-Web") and copy the `firebaseConfig` object.
4.  **Service Account (for Server-side)**:
    *   Go to **Project Settings > Service Accounts**.
    *   Click **Generate New Private Key**. This downloads a JSON file.
    *   You will need the `client_email` and `private_key` from this file for your `.env` variables.

### 2. Environment Variables
Create a `.env` file in the root directory and populate it with the following keys (using the data from the steps above):

```env
# Client-side (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Server-side (Private)
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# API Configuration
COMPANY_EMAIL="your-admin@example.com"
RESEND_API_KEY="re_..."
```

## 🏗️ Architecture

*   **Database**: This app uses **Cloud Firestore** (NoSQL). It does not require traditional SQL migrations.
*   **Authentication**: Integrated with Firebase Auth (Email/Password, Google, and Phone).
*   **Storage**: Firebase Storage is used for high-resolution design uploads.
*   **AI**: Powered by Genkit and Google Gemini for design generation and chatbot support.

## 🛠️ Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.
