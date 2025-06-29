'use server';

import { generateBoxDesign, GenerateBoxDesignInput } from '@/ai/flows/generate-box-design';

export interface FormState {
  message: string;
  design?: {
    designDescription: string;
    imageUrl: string;
  };
  fields?: Record<string, string>;
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
    const input: GenerateBoxDesignInput = { prompt };
    const result = await generateBoxDesign(input);
    
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
