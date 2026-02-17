
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import admin from '@/lib/firebase-admin';
import { z } from 'zod';
import { sendEmail } from '@/lib/email-service';
import WelcomeEmail from '@/emails/WelcomeEmail';
import SignInNotificationEmail from '@/emails/SignInNotificationEmail';
import { stripe } from '@/lib/stripe';


const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." });

export async function POST(request: NextRequest, { params }: { params: { route: string[] }}) {
    const route = params.route.join('/');
    const body = await request.formData();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    if (!app) {
        console.error('Firebase is not initialized. Check your configuration.');
        return NextResponse.json(
            { error: 'Authentication service is not available.' },
            { status: 503 }
        );
    }

    try {
        if (route === 'login') {
            const email = body.get('email') as string;
            const password = body.get('password') as string;
            const clientAuth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
            const idToken = await userCredential.user.getIdToken();
            
            const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });
            const response = NextResponse.redirect(new URL('/creator', request.url));
            response.cookies.set('session', sessionCookie, {
              maxAge: expiresIn,
              httpOnly: true,
              secure: true,
              path: '/',
              sameSite: 'lax',
            });
            
            // Send sign-in notification
            await sendEmail({
              to: email,
              subject: `New Sign-In to Your ${process.env.NEXT_PUBLIC_APP_NAME || 'Boxmoc'} Account`,
              react: SignInNotificationEmail({
                email: email,
                signInTime: new Date(),
                ipAddress: request.headers.get('x-forwarded-for') || undefined,
                userAgent: request.headers.get('user-agent'),
                appName: process.env.NEXT_PUBLIC_APP_NAME || 'Boxmoc'
              })
            });

            return response;
        } else if (route === 'signup') {
            const email = body.get('email') as string;
            const password = body.get('password') as string;
            const displayName = body.get('displayName') as string;

            const passwordValidation = passwordSchema.safeParse(password);
            if (!passwordValidation.success) {
                const errorMessage = passwordValidation.error.errors[0].message;
                const url = request.nextUrl.clone()
                url.pathname = '/signup';
                url.searchParams.set('error', errorMessage);
                return NextResponse.redirect(url);
            }

            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName,
            });

            const stripeCustomer = await stripe.customers.create({
                email,
                name: displayName,
                metadata: {
                    firebaseUID: userRecord.uid,
                },
            });
            
            const db = admin.firestore();
            await db.collection('users').doc(userRecord.uid).set({
                email: userRecord.email,
                displayName: userRecord.displayName || '',
                photoURL: userRecord.photoURL || null,
                createdAt: new Date().toISOString(),
                role: 'user',
                stripeCustomerId: stripeCustomer.id,
            });
            
            await sendEmail({
              to: email,
              subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Boxmoc'}!`,
              react: WelcomeEmail({ name: displayName, appName: process.env.NEXT_PUBLIC_APP_NAME || 'Boxmoc' })
            });

            const clientAuth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
            const idToken = await userCredential.user.getIdToken();
            
            const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });
            const response = NextResponse.redirect(new URL('/creator', request.url));
            response.cookies.set('session', sessionCookie, {
              maxAge: expiresIn,
              httpOnly: true,
              secure: true,
              path: '/',
              sameSite: 'lax',
            });
            
            return response;

        } else if (route === 'google-signin') {
            return NextResponse.redirect(new URL('/google-auth-handler', request.url));

        } else if (route === 'logout') {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('session');
            return response;
        }

    } catch (error: any) {
        console.error(error);
        const url = request.nextUrl.clone()
        url.pathname = route === 'login' ? '/login' : '/signup'
        url.searchParams.set('error', error.message)
        return NextResponse.redirect(url)
    }

    return NextResponse.json({ error: 'Invalid route' }, { status: 404 });
}

export async function GET(request: NextRequest, { params }: { params: { route: string[] }}) {
    const route = params.route.join('/');

    if(route === 'session') {
        const sessionCookie = cookies().get('session')?.value;
        if(!sessionCookie) {
            return NextResponse.json({ session: null }, { status: 401 });
        }
        try {
            const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);
            return NextResponse.json({ session: decodedIdToken });
        } catch (error) {
            return NextResponse.json({ session: null }, { status: 401 });
        }
    }
}
