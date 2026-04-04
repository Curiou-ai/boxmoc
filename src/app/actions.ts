
'use server';

import { generateDesign, GenerateDesignInput } from '@/ai/flows/generate-box-design';
import { askChatbot, ChatbotInput } from '@/ai/flows/chatbot-flow';
import { translateText, TranslateTextInput, TranslateTextOutput } from '@/ai/flows/translate-flow';
import { sendEmail } from '@/lib/email-service';
import admin from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import { getSession, UserProfile } from '@/lib/session';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { ContactFormSchema, WaitlistSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import WaitlistAccessCodeEmail from '@/emails/WaitlistAccessCode';

// --- Production SaaS Interfaces ---

export interface Order {
    id: string;
    userId: string;
    tenantId: string;
    status: 'CREATED' | 'PRICED' | 'MATCHED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED';
    designId: string;
    supplierId?: string;
    logisticsId?: string;
    amount: number;
    quantity: number;
    designImageUrl: string;
    designDescription: string;
    createdAt: string;
    shippingAddress: any;
}

export interface Supplier {
    id: string;
    name: string;
    location: string;
    costPerUnit: number;
    rating: number;
    capacity: number;
}

export interface Asset {
    id: string;
    url: string;
    name: string;
    createdAt: string;
}

export interface CRMUser extends UserProfile {
    uid: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    status: 'new' | 'contacted' | 'closed';
    source: string;
    createdAt: string;
    notes?: Array<{ id: string; content: string; author: string; createdAt: string }>;
}

export type FormState = {
    message: string;
    success?: boolean;
    design?: { imageUrl: string; designDescription: string };
    fields?: Record<string, any>;
};

export type HelpFormState = {
    message: string;
    success?: boolean;
    fields?: Record<string, any>;
};

export type WaitlistState = {
    message: string;
    success?: boolean;
    fields?: Record<string, any>;
};

export type AccessCodeState = {
    message: string;
};

export type ProfileFormState = {
    success: boolean;
    message: string;
};

export type ProfilePictureState = {
    success: boolean;
    message: string;
    newImageUrl?: string;
};

// --- Supplier Matching Logic ---

/**
 * Core Algorithm: Matches a manufacturer based on Unit Cost, Rating, and Proximity.
 */
export async function matchSupplier(orderId: string): Promise<{ success: boolean; supplierId?: string }> {
    const db = admin.firestore();
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) return { success: false };

    const orderData = orderDoc.data()!;
    
    // 1. Fetch available suppliers
    const suppliersSnap = await db.collection('suppliers').where('capacity', '>=', orderData.quantity).get();
    if (suppliersSnap.empty) return { success: false };

    const suppliers = suppliersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));

    // 2. Score and Sort
    const bestMatch = suppliers.map(s => ({
        ...s,
        score: (1 / s.costPerUnit) * 0.5 + s.rating * 0.3 + (s.location === orderData.shippingAddress.country ? 0.2 : 0.1)
    })).sort((a, b) => b.score - a.score)[0];

    // 3. Update Order Pipeline
    await db.collection('orders').doc(orderId).update({
        supplierId: bestMatch.id,
        status: 'MATCHED'
    });

    return { success: true, supplierId: bestMatch.id };
}

// --- Order Lifecycle Management ---

export async function createOrderPipeline(data: Partial<Order>): Promise<{ success: boolean; orderId?: string }> {
    const session = await getSession();
    if (!session) return { success: false };

    const db = admin.firestore();
    const orderRef = db.collection('orders').doc();
    
    const newOrder = {
        ...data,
        userId: session.uid,
        tenantId: session.tenantId,
        status: 'CREATED',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await orderRef.set(newOrder);
    
    revalidatePath('/creator/orders');
    return { success: true, orderId: orderRef.id };
}

// --- CRM & Admin Actions ---

export async function getWaitlistUsers() {
    const session = await getSession();
    if (!session || session.role !== 'admin') return [];
    const db = admin.firestore();
    const snapshot = await db.collection('waitlist').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as any));
}

export async function getCRMUsers() {
    const session = await getSession();
    if (!session || session.role !== 'admin') return [];
    const db = admin.firestore();
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ 
        uid: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as CRMUser));
}

export async function getContactSubmissions() {
    const session = await getSession();
    if (!session || session.role !== 'admin') return [];
    const db = admin.firestore();
    const snapshot = await db.collection('contact_submissions').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as ContactSubmission));
}

export async function getUserOrders(): Promise<Order[]> {
    const session = await getSession();
    if (!session) return [];

    const db = admin.firestore();
    const snapshot = await db.collection('orders')
        .where('tenantId', '==', session.tenantId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            amount: data.amountTotal || data.amount,
            status: data.status,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            designImageUrl: data.designImageUrl,
            designDescription: data.designDescription,
            shippingAddress: data.shippingAddress,
        } as Order;
    });
}

export async function updateCRMUserStatus(userId: string, status: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { success: false };
    const db = admin.firestore();
    await db.collection('users').doc(userId).update({ status });
    revalidatePath('/admin');
    return { success: true };
}

export async function updateContactStatus(contactId: string, status: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { success: false };
    const db = admin.firestore();
    await db.collection('contact_submissions').doc(contactId).update({ status });
    revalidatePath('/admin');
    return { success: true };
}

export async function addCRMNote(type: 'user' | 'contact', id: string, content: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { success: false };
    
    const db = admin.firestore();
    const note = {
        id: randomBytes(8).toString('hex'),
        content,
        author: session.displayName || 'Admin',
        createdAt: new Date().toISOString(),
    };

    const docRef = db.collection(type === 'user' ? 'users' : 'contact_submissions').doc(id);
    await docRef.update({
        notes: admin.firestore.FieldValue.arrayUnion(note)
    });
    
    revalidatePath('/admin');
    return { success: true };
}

// --- Waitlist Orchestration ---

export async function sendAccessCode(email: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { success: false, message: 'Unauthorized' };

  const accessCode = randomBytes(4).toString('hex').toUpperCase();
  const db = admin.firestore();
  
  const query = await db.collection('waitlist').where('email', '==', email).limit(1).get();
  if (query.empty) return { success: false, message: 'User not found' };

  await query.docs[0].ref.update({ 
    status: 'active', 
    code: accessCode 
  });

  await sendEmail({
    to: email,
    subject: "Your Boxmoc Early Access Code",
    react: WaitlistAccessCodeEmail({ accessCode, companyName: "Boxmoc" })
  });

  revalidatePath('/admin');
  return { success: true, message: 'Access code sent successfully.' };
}

export async function handleValidateAccessCode(prevState: any, formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return { message: 'Please enter a code.' };

    const db = admin.firestore();
    const query = await db.collection('waitlist').where('code', '==', code.toUpperCase()).limit(1).get();

    if (query.empty) {
        return { message: 'Invalid or expired access code.' };
    }

    const waitlistUser = query.docs[0].data();
    if (waitlistUser.status === 'redeemed') {
        return { message: 'This code has already been used.' };
    }

    // In a real app, you might set a short-lived signup cookie here
    redirect(`/signup?code=${code}`);
}

// --- Asset Management ---

export async function getUserAssets(): Promise<Asset[]> {
    const session = await getSession();
    if (!session) return [];

    const db = admin.firestore();
    const snapshot = await db.collection('users').doc(session.uid).collection('assets')
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Asset));
}

export async function handleUploadDesignImage(formData: FormData) {
    const session = await getSession();
    if (!session) return { success: false, message: 'Unauthorized' };

    const file = formData.get('image') as File;
    if (!file) return { success: false, message: 'No file provided' };

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `assets/${session.uid}/${Date.now()}-${file.name}`;
        const bucket = admin.storage().bucket();
        const fileRef = bucket.file(fileName);

        await fileRef.save(buffer, {
            metadata: { contentType: file.type },
        });

        // Make file public for preview (or use signed URLs in production)
        await fileRef.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        const db = admin.firestore();
        await db.collection('users').doc(session.uid).collection('assets').add({
            url: publicUrl,
            name: file.name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return { success: true, imageUrl: publicUrl };
    } catch (error: any) {
        console.error('Upload error:', error);
        return { success: false, message: error.message };
    }
}

// --- AI & Design Handlers ---

export async function handleGenerateDesign(prevState: any, formData: FormData) {
  const prompt = formData.get('prompt') as string;
  if (!prompt || prompt.length < 10) return { message: 'Prompt too short.' };
  
  try {
    const result = await generateDesign({ prompt });
    return { message: 'Design generated!', design: result, success: true };
  } catch (error) {
    console.error('Design generation error:', error);
    return { message: 'Generation failed. Please try again later.' };
  }
}

export async function handleJoinWaitlist(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const validation = WaitlistSchema.safeParse({ email });
  if (!validation.success) return { message: validation.error.errors[0].message, success: false, fields: { email } };

  try {
    const db = admin.firestore();
    const query = await db.collection('waitlist').where('email', '==', email).limit(1).get();
    
    if (!query.empty) {
        return { message: 'You are already on the list!', success: true };
    }

    await db.collection('waitlist').add({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'waitlisted',
      source: 'web_form'
    });
    redirect('/waitlist/congratulations');
  } catch (e) {
    if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) throw e;
    return { message: 'Error joining waitlist.', success: false };
  }
}

export async function handleChatbotQuery(prevState: any, formData: FormData) {
  const query = formData.get('query') as string;
  const history = JSON.parse(formData.get('history') as string || '[]');
  try {
    const result = await askChatbot({ query, history });
    return { response: result };
  } catch (error) {
    console.error('Chatbot error:', error);
    return { response: '', error: 'AI Assistant is currently unavailable.' };
  }
}

export async function handleRequestHelp(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const company = formData.get('company') as string;
  const phone = formData.get('phone') as string;
  const prompt = formData.get('prompt') as string;
  const notes = formData.get('notes') as string;

  const validation = ContactFormSchema.safeParse({ name, email, company, phone, prompt, notes });
  if (!validation.success) {
      return { message: validation.error.errors[0].message, success: false, fields: { name, email, prompt, notes } };
  }

  try {
      const db = admin.firestore();
      await db.collection('contact_submissions').add({
          name,
          email,
          company,
          phone,
          message: prompt || notes,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'new',
          source: 'support_request'
      });
      return { message: 'Your request has been sent to our design experts.', success: true };
  } catch (error) {
      return { message: 'Failed to send request.', success: false };
  }
}

export async function translateHeadline(currentText: string, targetLanguage: string) {
    try {
        const result = await translateText({ text: currentText, targetLanguage });
        return { translatedText: result.translatedText };
    } catch (error) {
        return { error: 'Translation failed.' };
    }
}

export async function handleUpdateProfile(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { success: false, message: 'Unauthorized' };

    const displayName = formData.get('displayName') as string;
    if (!displayName) return { success: false, message: 'Name is required' };

    const db = admin.firestore();
    await db.collection('users').doc(session.uid).update({ displayName });
    
    revalidatePath('/creator/profile');
    return { success: true, message: 'Profile updated successfully' };
}

export async function handleUpdateProfilePicture(formData: FormData) {
    const session = await getSession();
    if (!session) return { success: false, message: 'Unauthorized' };

    const file = formData.get('profilePicture') as File;
    if (!file) return { success: false, message: 'No file provided' };

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `profiles/${session.uid}/${Date.now()}-${file.name}`;
        const bucket = admin.storage().bucket();
        const fileRef = bucket.file(fileName);

        await fileRef.save(buffer, {
            metadata: { contentType: file.type },
        });

        await fileRef.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        const db = admin.firestore();
        await db.collection('users').doc(session.uid).update({ photoURL: publicUrl });

        revalidatePath('/creator/profile');
        return { success: true, message: 'Profile picture updated', newImageUrl: publicUrl };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function handleCreateOrderSession({ designImageUrl, designDescription }: { designImageUrl: string; designDescription: string }) {
    const session = await getSession();
    if (!session || !session.stripeCustomerId) return { error: 'Unauthorized' };

    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: session.stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { 
                        name: 'Boxmoc Custom Print', 
                        images: [designImageUrl.startsWith('http') ? designImageUrl : 'https://placehold.co/600x400'],
                        description: designDescription 
                    },
                    unit_amount: 4999,
                },
                quantity: 1,
            }],
            mode: 'payment',
            shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
            metadata: { 
                userId: session.uid, 
                tenantId: session.tenantId,
                designImageUrl, 
                designDescription: designDescription.substring(0, 499) 
            },
            success_url: `${origin}/creator/orders?success=true`,
            cancel_url: `${origin}/creator`,
        });

        return { sessionId: checkoutSession.id };
    } catch (error: any) {
        return { error: error.message };
    }
}
