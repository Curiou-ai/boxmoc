
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email-service';
import ContactUserConfirmation from '@/emails/ContactUserConfirmation';
import ContactCompanyNotification from '@/emails/ContactCompanyNotification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = admin.firestore();
    const submissionData = {
      name,
      email,
      company: company || null,
      phone: phone || null,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'api',
    };

    // 1. Save to Firestore
    await db.collection('contact_submissions').add(submissionData);

    // 2. Send Emails
    const companyEmail = process.env.COMPANY_EMAIL;
    if (companyEmail) {
      await sendEmail({
        to: email,
        subject: "We've received your message!",
        react: ContactUserConfirmation({ name, message, companyName: "Boxmoc" }),
      });

      await sendEmail({
        to: companyEmail,
        subject: `New Contact Form Submission from ${name}`,
        react: ContactCompanyNotification({ 
          name, 
          email, 
          company,
          phone,
          message,
        }),
      });
    }

    return NextResponse.json({ success: true, message: 'Submission received' });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
