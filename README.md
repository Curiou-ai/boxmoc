
# Boxmoc - AI Design Platform

This is a Next.js application integrated with Firebase, designed for AI-powered packaging and marketing material creation.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

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
