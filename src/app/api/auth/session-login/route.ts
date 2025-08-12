import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true, // Set to true in production
      path: '/',
    });
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error creating session cookie', error);
    return NextResponse.json({ status: 'error', message: 'Could not create session.' }, { status: 401 });
  }
}
