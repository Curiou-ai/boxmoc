'use server';

import { generateDesign, GenerateDesignInput } from '@/ai/flows/generate-box-design';
import { askChatbot, ChatbotInput } from '@/ai/flows/chatbot-flow';
import { translateText, TranslateTextInput, TranslateTextOutput } from '@/ai/flows/translate-flow';
import { sendEmail } from '@/lib/email-service';
import ContactUserConfirmation from '@/emails/ContactUserConfirmation';
import ContactCompanyNotification from '@/emails/ContactCompanyNotification';
import admin from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import WaitlistAccessCodeEmail from '@/emails/WaitlistAccessCode';
import { getSession } from '@/lib/session';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { ContactFormSchema, EmailSchema, NameSchema, WaitlistSchema } from '@/lib/validations';

export interface FormState {
  message: string;
  design?: {
    designDescription: string;
    imageUrl: string;
  };
  fields?: Record<string, string>;
}

export interface UploadState {
    success: boolean;
    message: string;
    imageUrl?: string;
}

export interface Asset {
    id: string;
    url: string;
    name: string;
    createdAt: string;
}

export interface HelpFormState {
  message: string;
  success?: boolean;
  fields?: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    prompt?: string;
    notes?: string;
  };
}

export interface ChatbotState {
  response: string;
  error?: string;
}

export interface TranslationState {
    translatedText?: string;
    error?: string;
}

export interface WaitlistState {
  message: string;
  success?: boolean;
  fields?: {
    email?: string;
  };
}

export interface AccessCodeState {
    message: string;
}

export interface ActivationState {
    success: boolean;
    message: string;
}

export interface ProfileFormState {
  message: string;
  success: boolean;
}

export interface ProfilePictureState {
  message: string;
  success: boolean;
  newImageUrl?: string;
}

export interface WaitlistUser {
    id: string;
    email: string;
    status: 'waitlisted' | 'active' | 'redeemed';
    code: string | null;
    createdAt: string;
    source?: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    createdAt: string;
    source: string;
}

export interface OrderSessionState {
  sessionId?: string;
  error?: string;
}

export interface Order {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    designImageUrl: string;
    designDescription: string;
    shippingAddress: any;
}

// --- Image Assets ---

export async function handleUploadDesignImage(formData: FormData): Promise<UploadState> {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'You must be logged in to upload images.' };
    }

    const file = formData.get('image') as File;
    if (!file) {
        return { success: false, message: 'No image file provided.' };
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
        return { success: false, message: 'File is too large. Maximum size is 10MB.' };
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { success: false, message: 'Invalid file format. Please upload JPEG, PNG, or WebP.' };
    }

    try {
        const bucket = admin.storage().bucket();
        const buffer = Buffer.from(await file.arrayBuffer());
        const extension = file.type.split('/')[1];
        const fileName = `user-uploads/${session.uid}/${Date.now()}.${extension}`;
        const fileRef = bucket.file(fileName);

        await fileRef.save(buffer, {
            metadata: {
                contentType: file.type,
                cacheControl: 'public, max-age=31536000',
            },
            public: true,
        });

        const publicUrl = fileRef.publicUrl();

        const db = admin.firestore();
        await db.collection('users').doc(session.uid).collection('assets').add({
            url: publicUrl,
            name: file.name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            type: file.type,
            size: file.size
        });

        return { success: true, message: 'Upload successful!', imageUrl: publicUrl };

    } catch (error: any) {
        console.error('Upload Error:', error);
        return { success: false, message: 'An error occurred during upload. Please try again.' };
    }
}

export async function getUserAssets(): Promise<Asset[]> {
    const session = await getSession();
    if (!session) return [];

    try {
        const db = admin.firestore();
        const assetsRef = db.collection('users').doc(session.uid).collection('assets').orderBy('createdAt', 'desc');
        const snapshot = await assetsRef.get();

        if (snapshot.empty) return [];

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                url: data.url,
                name: data.name,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as Asset;
        });
    } catch (error) {
        console.error("Error fetching assets:", error);
        return [];
    }
}

// --- Waitlist Management ---

export async function getWaitlistUsers(): Promise<WaitlistUser[]> {
    const db = admin.firestore();
    const waitlistCol = db.collection('waitlist');
    const q = waitlistCol.orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    
    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            email: data.email,
            status: data.status,
            code: data.code,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            source: data.source,
        };
    });
}

export async function handleJoinWaitlist(prevState: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = formData.get('email') as string;

  const validation = WaitlistSchema.safeParse({ email });
  if (!validation.success) {
    return {
      message: validation.error.errors[0].message,
      success: false,
      fields: { email }
    };
  }

  try {
    const db = admin.firestore();
    const waitlistCollection = db.collection('waitlist');

    const q = waitlistCollection.where("email", "==", email);
    const querySnapshot = await q.get();
    if (!querySnapshot.empty) {
      redirect('/waitlist/congratulations');
    }

    await waitlistCollection.add({
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'waitlisted',
      code: null,
      source: 'web_form'
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
    console.error("Error adding to waitlist: ", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      success: false,
      fields: { email }
    };
  }

  redirect('/waitlist/congratulations');
}

// --- Contact Submissions ---

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    const db = admin.firestore();
    const contactsCol = db.collection('contact_submissions');
    const q = contactsCol.orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    
    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            email: data.email,
            company: data.company,
            phone: data.phone,
            message: data.message,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            source: data.source || 'web_form',
        };
    });
}

export async function handleRequestHelp(
  prevState: HelpFormState,
  formData: FormData,
): Promise<HelpFormState> {
  const fields = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    company: formData.get('company')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    prompt: formData.get('prompt')?.toString() || '',
    notes: formData.get('notes')?.toString() || '',
  }

  const validation = ContactFormSchema.safeParse(fields);
  
  if (!validation.success) {
    return {
        message: validation.error.errors[0].message,
        success: false,
        fields,
    };
  }

  const messageContent = fields.prompt || fields.notes;
  const companyEmail = process.env.COMPANY_EMAIL;
  
  try {
    const db = admin.firestore();
    
    await db.collection('contact_submissions').add({
      ...fields,
      message: messageContent,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'web_form'
    });

    if (companyEmail) {
        await sendEmail({
          to: fields.email,
          subject: "We've received your message!",
          react: ContactUserConfirmation({ name: fields.name, message: messageContent!, companyName: "Boxmoc" }),
        });

        await sendEmail({
          to: companyEmail,
          subject: `New Contact Form Submission from ${fields.name}`,
          react: ContactCompanyNotification({ 
            name: fields.name, 
            email: fields.email, 
            company: fields.company,
            phone: fields.phone,
            message: messageContent!,
          }),
        });
    }

    return {
      message: "Your request has been sent! We'll get back to you shortly.",
      success: true,
    };
  } catch (error) {
    console.error('Help Request Error:', error);
    return {
      message: 'An unexpected error occurred while sending your message.',
      fields,
    };
  }
}

// --- AI & Utilities ---

export async function handleChatbotQuery(
  prevState: ChatbotState,
  formData: FormData,
): Promise<ChatbotState> {
  const query = formData.get('query') as string;
  const history = JSON.parse(formData.get('history') as string || '[]');

  if (!query) return { response: '', error: 'Query is missing.' };

  try {
    const result = await askChatbot({ query, history });
    return { response: result };
  } catch (error) {
    console.error(error);
    return { response: '', error: 'An error occurred with the AI service.' };
  }
}

export async function handleGenerateDesign(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const prompt = formData.get('prompt');

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return {
      message: 'Please provide a more detailed description (min 10 chars).',
      fields: { prompt: prompt?.toString() || "" },
    };
  }
  
  try {
    const result = await generateDesign({ prompt });
    return { message: 'Design generated!', design: result };
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to generate design.',
      fields: { prompt: prompt.toString() },
    };
  }
}

export async function translateHeadline(currentText: string, targetLanguage: string): Promise<TranslationState> {
    try {
        const result = await translateText({ text: currentText, targetLanguage });
        return { translatedText: result.translatedText };
    } catch (error) {
        console.error('Translation error:', error);
        return { error: 'Translation failed.' };
    }
}

// --- Access Codes ---

export async function sendAccessCode(email: string): Promise<ActivationState> {
  const db = admin.firestore();
  if (!email) return { success: false, message: "Email is required." };

  try {
    const waitlistCollection = db.collection('waitlist');
    const q = waitlistCollection.where("email", "==", email).where("status", "==", "waitlisted");
    const querySnapshot = await q.get();

    if (querySnapshot.empty) return { success: false, message: "User not found or already active." };

    const accessCode = randomBytes(4).toString('hex').toUpperCase();
    await querySnapshot.docs[0].ref.update({ code: accessCode, status: 'active' });

    await sendEmail({
      to: email,
      subject: "Your Access Code for Boxmoc",
      react: WaitlistAccessCodeEmail({ accessCode, companyName: "Boxmoc" }),
    });

    return { success: true, message: `Code sent to ${email}.` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error sending access code." };
  }
}

export async function handleValidateAccessCode(prevState: AccessCodeState, formData: FormData): Promise<AccessCodeState> {
    const code = formData.get('code') as string;
    const db = admin.firestore();

    if (!code) return { message: 'Please enter an access code.' };
    
    try {
        const waitlistCollection = db.collection('waitlist');
        const q = waitlistCollection.where("code", "==", code.trim().toUpperCase()).where("status", "==", "active");
        const querySnapshot = await q.get();

        if (querySnapshot.empty) return { message: 'Invalid or used code.' };
        await querySnapshot.docs[0].ref.update({ status: 'redeemed' });
    } catch (error) {
        console.error(error);
        return { message: "Error validating code." };
    }

    redirect('/signup');
}

// --- Orders ---

export async function handleCreateOrderSession(
    { designImageUrl, designDescription }: { designImageUrl: string; designDescription: string }
): Promise<OrderSessionState> {
    const session = await getSession();
    if (!session || !session.stripeCustomerId) return { error: 'Not logged in.' };

    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    try {
        const db = admin.firestore();
        const bucket = admin.storage().bucket();
        let permanentImageUrl = designImageUrl;

        if (designImageUrl.startsWith('data:')) {
            const mimeType = designImageUrl.match(/data:(.*);base64,/)?.[1] || 'image/png';
            const base64Data = designImageUrl.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const fileId = db.collection('tmp').doc().id;
            const filePath = `user-designs/${session.uid}/${fileId}.png`;
            const file = bucket.file(filePath);
            await file.save(imageBuffer, { metadata: { contentType: mimeType }, public: true });
            permanentImageUrl = file.publicUrl();
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: session.stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Custom Design Print', images: [permanentImageUrl] },
                    unit_amount: 4999,
                },
                quantity: 1,
            }],
            mode: 'payment',
            shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
            metadata: { userId: session.uid, designImageUrl: permanentImageUrl, designDescription: designDescription.substring(0, 499) },
            success_url: `${origin}/creator/orders?success=true`,
            cancel_url: `${origin}/creator`,
        });

        return { sessionId: checkoutSession.id };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getUserOrders(): Promise<Order[]> {
    const session = await getSession();
    if (!session) return [];

    const db = admin.firestore();
    const snapshot = await db.collection('users').doc(session.uid).collection('orders').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            amount: data.amountTotal,
            status: data.status,
            createdAt: data.createdAt.toDate().toISOString(),
            designImageUrl: data.designImageUrl,
            designDescription: data.designDescription,
            shippingAddress: data.shippingAddress,
        };
    });
}

// --- Profile ---

export async function handleUpdateProfile(prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
    const session = await getSession();
    if (!session) return { success: false, message: 'Not logged in.' };

    const displayName = formData.get('displayName') as string;
    const validation = NameSchema.safeParse(displayName);
    if (!validation.success) return { success: false, message: validation.error.errors[0].message };

    try {
        await admin.auth().updateUser(session.uid, { displayName });
        await admin.firestore().collection('users').doc(session.uid).update({ displayName });
        return { success: true, message: 'Profile updated!' };
    } catch (error) {
        return { success: false, message: 'Update failed.' };
    }
}

export async function handleUpdateProfilePicture(prevState: ProfilePictureState, formData: FormData): Promise<ProfilePictureState> {
    const session = await getSession();
    if (!session) return { success: false, message: 'Not logged in.' };

    const newImageUrl = `https://picsum.photos/seed/${Math.random()}/200/200`;
    try {
        await admin.auth().updateUser(session.uid, { photoURL: newImageUrl });
        await admin.firestore().collection('users').doc(session.uid).update({ photoURL: newImageUrl });
        return { success: true, message: 'Picture updated!', newImageUrl };
    } catch (error) {
        return { success: false, message: 'Update failed.' };
    }
}
