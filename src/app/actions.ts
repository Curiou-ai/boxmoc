'use server';

import { generateDesign, GenerateDesignInput } from '@/ai/flows/generate-box-design';
import { askChatbot, ChatbotInput } from '@/ai/flows/chatbot-flow';
import { translateText, TranslateTextInput, TranslateTextOutput } from '@/ai/flows/translate-flow';
import { sendEmail } from '@/lib/email-service';
import ContactUserConfirmation from '@/emails/ContactUserConfirmation';
import ContactCompanyNotification from '@/emails/ContactCompanyNotification';

export interface FormState {
  message: string;
  design?: {
    designDescription: string;
    imageUrl: string;
  };
  fields?: Record<string, string>;
}

export interface HelpFormState {
  message: string;
  success?: boolean;
  fields?: {
    name?: string;
    email?: string;
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

  // Check if this looks like a contact info submission from the chatbot
  const containsContactInfo = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(query) && query.length > 30;
  const lastBotMessage = history?.slice(-1).find((m: any) => m.role === 'model')?.content;

  if (containsContactInfo && lastBotMessage?.includes("create a support ticket")) {
    const fakeForm = new FormData();
    // Simple parsing, assumes "Name, email, message" format. A more robust solution might use regex.
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
    console.error(error); // Log the actual error for debugging
    // To keep the UI clean, return a generic error message to the user.
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
      fields: { prompt: prompt?.toString() || "" },
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
  const name = formData.get('name');
  const email = formData.get('email');
  const company = formData.get('company');
  const phone = formData.get('phone');
  const prompt = formData.get('prompt'); // This is the 'message' field from contact form
  const notes = formData.get('notes'); // This is from the 'request help' dialog

  const fields = {
    name: name?.toString() || '',
    email: email?.toString() || '',
    company: company?.toString() || '',
    phone: phone?.toString() || '',
    prompt: prompt?.toString() || '',
    notes: notes?.toString() || '',
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return { message: 'Please enter a valid name.', fields };
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { message: 'Please enter a valid email address.', fields };
  }
  
  const messageContent = prompt || notes;
  if (!messageContent || typeof messageContent !== 'string' || messageContent.trim().length < 10) {
    return { message: 'Please provide a message with at least 10 characters.', fields };
  }
  
  const companyEmail = process.env.COMPANY_EMAIL;
  if (!companyEmail) {
    console.error("COMPANY_EMAIL environment variable is not set.");
    return { message: 'An unexpected error occurred. The server is not configured for sending emails.', fields };
  }

  try {
    // 1. Send confirmation email to the user
    await sendEmail({
      to: fields.email,
      subject: "We've received your message!",
      react: ContactUserConfirmation({ name: fields.name, message: messageContent, companyName: "Boxmoc" }),
    });

    // 2. Send notification email to the company
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
    console.error('Email Sending Error:', error);
    return {
      message: 'An unexpected error occurred while sending your message. Please try again later.',
      fields,
    };
  }
}
