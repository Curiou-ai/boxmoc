import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email-service';
import ContactUserConfirmation from '@/emails/ContactUserConfirmation';
import ContactCompanyNotification from '@/emails/ContactCompanyNotification';
import { ContactFormSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ContactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation Failed', 
        details: validation.error.errors[0].message 
      }, { status: 400 });
    }

    const { name, email, company, phone, prompt, notes } = validation.data;
    const message = prompt || notes;

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
        react: ContactUserConfirmation({ name, message: message!, companyName: "Boxmoc" }),
      });

      await sendEmail({
        to: companyEmail,
        subject: `New Contact Form Submission from ${name}`,
        react: ContactCompanyNotification({ 
          name, 
          email, 
          company,
          phone,
          message: message!,
        }),
      });
    }

    return NextResponse.json({ success: true, message: 'Submission received' });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
