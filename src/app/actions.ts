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
import { ContactFormSchema, EmailSchema, NameSchema } from '@/lib/validations';

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

export async function handleUploadDesignImage(formData: FormData): Promise<UploadState> {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'You must be logged in to upload images.' };
    }

    const file = formData.get('image') as File;
    if (!file) {
        return { success: false, message: 'No image file provided.' };
    }

    // Validation: Size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
        return { success: false, message: 'File is too large. Maximum size is 10MB.' };
    }

    // Validation: Type
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

        // Robust Transaction: Save metadata to Firestore for the library
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

export async function handleCreateOrderSession(
    { designImageUrl, designDescription }: { designImageUrl: string; designDescription: string }
): Promise<OrderSessionState> {
    const session = await getSession();
    if (!session || !session.stripeCustomerId) {
        return { error: 'You must be logged in to place an order.' };
    }

    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    try {
        const db = admin.firestore();
        const bucket = admin.storage().bucket();
        
        let permanentImageUrl = designImageUrl;

        // If it's a data URI (from AI generation), we save it to storage
        if (designImageUrl.startsWith('data:')) {
            const mimeType = designImageUrl.match(/data:(.*);base64,/)?.[1] || 'image/png';
            const extension = mimeType.split('/')[1] || 'png';
            const base64Data = designImageUrl.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');
            
            const fileId = db.collection('tmp').doc().id;
            const filePath = `user-designs/${session.uid}/${fileId}.${extension}`;
            const file = bucket.file(filePath);

            await file.save(imageBuffer, {
                metadata: {
                    contentType: mimeType,
                    cacheControl: 'public, max-age=31536000',
                },
                public: true,
            });

            permanentImageUrl = file.publicUrl();
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: session.stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Custom Design Print',
                            description: designDescription,
                            images: [permanentImageUrl],
                        },
                        unit_amount: 4999,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'FR', 'DE'],
            },
            metadata: {
                userId: session.uid,
                designImageUrl: permanentImageUrl,
                designDescription: designDescription.substring(0, 499),
            },
            success_url: `${origin}/creator/orders?success=true`,
            cancel_url: `${origin}/creator`,
        });

        if (!checkoutSession.id) {
            return { error: 'Could not create checkout session.' };
        }

        return { sessionId: checkoutSession.id };

    } catch (error: any) {
        console.error('Stripe Order Session Error:', error);
        return { error: error.message };
    }
}

export async function getUserOrders(): Promise<Order[]> {
    const session = await getSession();
    if (!session) {
        return [];
    }

    const db = admin.firestore();
    const ordersRef = db.collection('users').doc(session.uid).collection('orders').orderBy('createdAt', 'desc');
    const snapshot = await ordersRef.get();

    if (snapshot.empty) {
        return [];
    }

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

export async function handleUpdateProfile(prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'You must be logged in to update your profile.' };
    }

    const displayName = formData.get('displayName') as string;

    const validation = NameSchema.safeParse(displayName);
    if (!validation.success) {
        return { success: false, message: validation.error.errors[0].message };
    }

    try {
        const db = admin.firestore();
        await admin.auth().updateUser(session.uid, { displayName });
        await db.collection('users').doc(session.uid).update({ displayName });
        
        return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function handleUpdateProfilePicture(prevState: ProfilePictureState, formData: FormData): Promise<ProfilePictureState> {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'You must be logged in to update your profile picture.' };
    }

    const newImageUrl = `https://picsum.photos/seed/${Math.random()}/200/200`;

    try {
        const db = admin.firestore();
        await admin.auth().updateUser(session.uid, { photoURL: newImageUrl });
        await db.collection('users').doc(session.uid).update({ photoURL: newImageUrl });

        return { success: true, message: 'Profile picture updated!', newImageUrl };
    } catch (error) {
        console.error("Error updating profile picture:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

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
            createdAt: data.createdAt.toDate().toISOString(),
        };
    });
}

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
            createdAt: data.createdAt.toDate().toISOString(),
            source: data.source || 'web_form',
        };
    });
}

export async function handleJoinWaitlist(prevState: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = formData.get('email') as string;

  const validation = EmailSchema.safeParse(email);
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
    });

  } catch (error) {
    console.error("Error adding document to waitlist: ", error);
    return {
      message: "An unexpected error occurred on our end. Please try again.",
      success: false,
      fields: { email }
    };
  }

  redirect('/waitlist/congratulations');
}

export async function sendAccessCode(email: string): Promise<ActivationState> {
  const db = admin.firestore();
  
  if (!email) {
    return { success: false, message: "Email is required." };
  }

  try {
    const waitlistCollection = db.collection('waitlist');
    const q = waitlistCollection.where("email", "==", email).where("status", "==", "waitlisted");
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return { success: false, message: "User not found on the waitlist or has already been activated." };
    }

    const userDoc = querySnapshot.docs[0];
    const accessCode = randomBytes(4).toString('hex').toUpperCase();

    const batch = db.batch();
    batch.update(userDoc.ref, { 
      code: accessCode,
      status: 'active' 
    });
    await batch.commit();

    await sendEmail({
      to: email,
      subject: "Your Early Access Code for Boxmoc is here!",
      react: WaitlistAccessCodeEmail({ accessCode, companyName: "Boxmoc" }),
    });

    return { success: true, message: `Access code sent successfully to ${email}.` };

  } catch (error) {
    console.error("Error sending access code: ", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function handleValidateAccessCode(prevState: AccessCodeState, formData: FormData): Promise<AccessCodeState> {
    const code = formData.get('code') as string;
    const db = admin.firestore();

    if (!code) {
        return { message: 'Please enter an access code.' };
    }
    
    try {
        const waitlistCollection = db.collection('waitlist');
        const q = waitlistCollection.where("code", "==", code.trim().toUpperCase()).where("status", "==", "active");
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
            return { message: 'Invalid or already used access code. Please try again.' };
        }

        const batch = db.batch();
        const docToUpdate = querySnapshot.docs[0];
        batch.update(docToUpdate.ref, { status: 'redeemed' });
        await batch.commit();

    } catch (error) {
        console.error("Error validating access code: ", error);
        return { message: "An unexpected error occurred. Please try again later." };
    }

    redirect('/signup');
}

export async function translateHeadline(
    currentText: string,
    targetLanguage: string
): Promise<TranslationState> {
    try {
        const input: TranslateTextInput = { text: currentText, targetLanguage };
        const result: TranslateTextOutput = await translateText(input);
        return { translatedText: result.translatedText };
    } catch (error) {
        console.error('Translation error:', error);
        return { error: 'Failed to translate. Please try again.' };
    }
}

export async function handleChatbotQuery(
  prevState: ChatbotState,
  formData: FormData,
): Promise<ChatbotState> {
  const query = formData.get('query') as string;
  const history = JSON.parse(formData.get('history') as string || '[]');

  if (!query) {
    return {
      response: '',
      error: 'Query is missing.'
    };
  }

  const containsContactInfo = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(query) && query.length > 30;
  const lastBotMessage = history?.slice(-1).find((m: any) => m.role === 'model')?.content;

  if (containsContactInfo && lastBotMessage?.includes("create a support ticket")) {
    const fakeForm = new FormData();
    const parts = query.split(',');
    fakeForm.append('name', parts[0]?.trim() || 'N/A');
    fakeForm.append('email', parts[1]?.trim() || 'N/A');
    fakeForm.append('prompt', 'Chatbot Inquiry');
    fakeForm.append('notes', parts.slice(2)?.join(',').trim() || query);
    
    const result = await handleRequestHelp({ message: '' }, fakeForm);
    if(result.success) {
      return { response: result.message };
    } else {
      return { response: `I couldn't submit your request. ${result.message}` };
    }
  }

  try {
    const input: ChatbotInput = { query, history };
    const result = await askChatbot(input);
    return { response: result };
  } catch (error) {
    console.error(error);
    return {
        response: '',
        error: 'Error: An error occurred. Please try again later.'
    };
  }
}

export async function handleGenerateDesign(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const prompt = formData.get('prompt');

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return {
      message: 'Please provide a more detailed description for the design (at least 10 characters).',
      fields: { prompt: prompt.toString() || "" },
    };
  }
  
  try {
    const input: GenerateDesignInput = { prompt };
    const result = await generateDesign(input);
    
    if (!result.imageUrl || !result.designDescription) {
        throw new Error("AI failed to generate a complete design.");
    }

    return {
      message: 'Design generated successfully!',
      design: result,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `An error occurred while generating the design: ${errorMessage}`,
      fields: { prompt: prompt.toString() },
    };
  }
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
  
  if (!companyEmail) {
    console.error("COMPANY_EMAIL environment variable is not set.");
    return { message: 'An unexpected error occurred. The server is not configured for sending emails.', fields };
  }

  try {
    const db = admin.firestore();
    
    // 1. Save to Firestore
    await db.collection('contact_submissions').add({
      ...fields,
      message: messageContent,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'web_form'
    });

    // 2. Send confirmation email to the user
    await sendEmail({
      to: fields.email,
      subject: "We've received your message!",
      react: ContactUserConfirmation({ name: fields.name, message: messageContent, companyName: "Boxmoc" }),
    });

    // 3. Send notification email to the company
    await sendEmail({
      to: companyEmail,
      subject: `New Contact Form Submission from ${fields.name}`,
      react: ContactCompanyNotification({ 
        name: fields.name, 
        email: fields.email, 
        company: fields.company,
        phone: fields.phone,
        message: messageContent,
      }),
    });

    return {
      message: "Your request has been sent! We'll get back to you shortly.",
      success: true,
    };
  } catch (error) {
    console.error('Help Request Error:', error);
    return {
      message: 'An unexpected error occurred while sending your message. Please try again later.',
      fields,
    };
  }
}
