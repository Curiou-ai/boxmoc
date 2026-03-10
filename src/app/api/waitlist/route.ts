import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { EmailSchema } from '@/lib/validations';

/**
 * API Route for waitlist submissions.
 * POST /api/waitlist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const validation = EmailSchema.safeParse(email);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation Failed', 
        details: validation.error.errors[0].message 
      }, { status: 400 });
    }

    const db = admin.firestore();
    const waitlistCollection = db.collection('waitlist');

    // Check if the user is already on the waitlist
    const q = waitlistCollection.where("email", "==", email);
    const querySnapshot = await q.get();
    
    if (!querySnapshot.empty) {
       return NextResponse.json({ 
         success: true, 
         message: 'You are already on the waitlist.' 
       }, { status: 200 });
    }

    // Add to Firestore
    await waitlistCollection.add({
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'waitlisted',
      code: null,
      source: 'api'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!' 
    });
  } catch (error: any) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}
