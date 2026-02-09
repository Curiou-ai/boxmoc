
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email-service';
import SignInNotificationEmail from '@/emails/SignInNotificationEmail';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ status: 'error', message: 'ID token is missing.' }, { status: 400 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    // Verify the ID token to get user details. This is a security best practice.
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await admin.auth().getUser(decodedToken.uid);

    // Create the session cookie.
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true, // Set to true in production
      path: '/',
      sameSite: 'lax',
    });
    
    // Send sign-in notification email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `New Sign-In to Your ${process.env.NEXT_PUBLIC_APP_NAME || 'Boxmoc'} Account`,
        react: SignInNotificationEmail({
          email: user.email,
          signInTime: new Date(),
          ipAddress: request.headers.get('x-forwarded-for') || undefined,
          userAgent: request.headers.get('user-agent'),
          appName: process.env.NEXT_PUBLIC_APP_NAME || 'Boxmoc'
        })
      });
    }
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error creating session cookie or sending email', error);
    return NextResponse.json({ status: 'error', message: 'Could not create session.' }, { status: 401 });
  }
}
