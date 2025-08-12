import 'server-only';
import { cookies } from 'next/headers';
import { DecodedIdToken } from 'firebase-admin/auth';
import admin from './firebase-admin';

export async function getSession(): Promise<DecodedIdToken | null> {
  const session = cookies().get('session')?.value;
  if (!session) {
    return null;
  }

  try {
    const decodedIdToken = await admin.auth().verifySessionCookie(session, true);
    return decodedIdToken;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
