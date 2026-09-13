
'use server';

import { generateDesign, GenerateDesignInput } from '@/ai/flows/generate-box-design';
import { askChatbot, ChatbotInput } from '@/ai/flows/chatbot-flow';
import admin from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { addCustomBoxToCart } from '@/lib/shopify-storefront';
import { revalidatePath } from 'next/cache';

// --- Shopify Integration Types ---
export interface DesignParams {
    boxTier: 'shipper' | 'retailer' | 'keepsake';
    dimensions: { width: number; height: number; depth: number };
    canvasJson: any;
    logoSvgUrl: string;
    previewUrl: string;
}

/**
 * Main orchestration for adding a custom box to the shopify checkout.
 * 1. Saves design parameters to Firestore.
 * 2. Appends to Shopify Cart with design metadata.
 * 3. Returns the checkout URL.
 */
export async function handleAddToCartFlow(params: DesignParams) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'Please sign in to save your design.' };
    }

    try {
        const db = admin.firestore();
        
        // 1. Persist Design Record
        const designRef = db.collection('designs').doc();
        await designRef.set({
            ...params,
            userId: session.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // 2. Add to Shopify Cart
        // Note: variantId should be mapped from boxTier in a real production env
        const variantMap = {
            shipper: process.env.SHOPIFY_VARIANT_SHIPPER_ID || '123',
            retailer: process.env.SHOPIFY_VARIANT_RETAILER_ID || '456',
            keepsake: process.env.SHOPIFY_VARIANT_KEEPSAKE_ID || '789'
        };

        const cart = await addCustomBoxToCart({
            variantId: variantMap[params.boxTier],
            quantity: 1, // Default or passed from frontend
            designId: designRef.id,
            previewUrl: params.previewUrl,
            boxTier: params.boxTier
        });

        return { success: true, checkoutUrl: cart.checkoutUrl };
    } catch (error: any) {
        console.error('Cart Flow Error:', error);
        return { success: false, message: error.message };
    }
}

// ... rest of existing actions remain for UI support ...

export async function handleGenerateDesign(prevState: any, formData: FormData) {
  const prompt = formData.get('prompt') as string;
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) return { message: 'Please provide a more detailed description (min 10 chars).',
    fields: { prompt: prompt?.toString() || "" }, };
  
  try {
    const result = await generateDesign({ prompt });
    return { message: 'Design generated!', design: result, success: true };
  } catch (error) {
    console.error('Failed to generate design:', error);
    return { message: 'Generation failed. Please try again later.' };
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

export async function getUserOrders() {
    const session = await getSession();
    if (!session) return [];

    const db = admin.firestore();
    const snapshot = await db.collection('orders')
        .where('userId', '==', session.uid)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
}
