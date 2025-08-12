import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase';
import admin from '@/lib/firebase-admin';


async function createSession(idToken: string) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: '/',
    });
}

export async function POST(request: NextRequest, { params }: { params: { route: string[] }}) {
    const route = params.route.join('/');
    const body = await request.formData();

    try {
        if (route === 'login') {
            const email = body.get('email') as string;
            const password = body.get('password') as string;
            const clientAuth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
            const idToken = await userCredential.user.getIdToken();
            await createSession(idToken);
            return NextResponse.redirect(new URL('/creator', request.url));
        } else if (route === 'signup') {
            const email = body.get('email') as string;
            const password = body.get('password') as string;
            const displayName = body.get('displayName') as string;

            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName,
            });
            
            // Login user to create session
            const clientAuth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
            const idToken = await userCredential.user.getIdToken();
            await createSession(idToken);
            
            return NextResponse.redirect(new URL('/creator', request.url));

        } else if (route === 'google-signin') {
             // This route is tricky because Google Sign-In is a client-side flow.
             // This POST is a trigger. We redirect to a page that will handle it.
             // Better would be a pure client-side implementation.
             // For now, redirecting to a page that starts the popup flow.
            return NextResponse.redirect(new URL('/google-auth-handler', request.url));

        } else if (route === 'logout') {
            cookies().delete('session');
            return NextResponse.redirect(new URL('/login', request.url));
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
