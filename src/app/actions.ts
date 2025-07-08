'use server';

import { generateDesign, GenerateDesignInput } from '@/ai/flows/generate-box-design';
import { askChatbot, ChatbotInput } from '@/ai/flows/chatbot-flow';

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
  const prompt = formData.get('prompt');
  const notes = formData.get('notes');

  const fields = {
    name: name?.toString() || '',
    email: email?.toString() || '',
    prompt: prompt?.toString() || '',
    notes: notes?.toString() || '',
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return {
      message: 'Please enter a valid name.',
      fields,
    };
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return {
      message: 'Please enter a valid email address.',
      fields,
    };
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return {
      message: 'Please provide a more detailed design prompt (at least 10 characters).',
      fields,
    };
  }

  try {
    // In a real application, you would send this data to a CRM, email service, or database.
    // For this prototype, we'll just log it to the server console.
    console.log('--- New Design Help Request ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Prompt:', prompt);
    console.log('Notes:', notes);
    console.log('-----------------------------');

    return {
      message: "Your request has been sent! Our design team will contact you shortly.",
      success: true,
    };
  } catch (error) {
    console.error('Help Request Error:', error);
    return {
      message: 'An unexpected error occurred. Please try again later.',
      fields,
    };
  }
}
