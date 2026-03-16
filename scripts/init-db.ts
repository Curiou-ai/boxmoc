
import { config } from 'dotenv';
import admin from '../src/lib/firebase-admin';

config();

/**
 * Script to initialize Firestore collections by performing a test write.
 * Run with: npm run db:init
 */
async function initializeCollections() {
  console.log('🚀 Initializing Firestore Collections...');
  
  const db = admin.firestore();

  try {
    // 1. Initialize Waitlist Collection
    const waitlistRef = db.collection('waitlist').doc('init-placeholder');
    await waitlistRef.set({
      email: 'init@boxmoc.com',
      status: 'active',
      code: 'WELCOME1',
      source: 'system_init',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Waitlist collection initialized.');

    // 2. Initialize Contact Submissions Collection
    const contactRef = db.collection('contact_submissions').doc('init-placeholder');
    await contactRef.set({
      name: 'System Initializer',
      email: 'support@boxmoc.com',
      message: 'Initial database verification message.',
      status: 'closed',
      source: 'system_init',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Contact Submissions collection initialized.');

    // Cleanup placeholders (Optional)
    // await waitlistRef.delete();
    // await contactRef.delete();

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing collections:', error);
    process.exit(1);
  }
}

initializeCollections();
