'use server';

/**
 * @fileOverview An AI agent for generating box designs based on user prompts.
 *
 * - generateBoxDesign - A function that handles the box design generation process.
 * - GenerateBoxDesignInput - The input type for the generateBoxDesign function.
 * - GenerateBoxDesignOutput - The return type for the generateBoxDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBoxDesignInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the desired box design.'),
});
export type GenerateBoxDesignInput = z.infer<typeof GenerateBoxDesignInputSchema>;

const GenerateBoxDesignOutputSchema = z.object({
  designDescription: z.string().describe('A textual description of the generated box design.'),
  imageUrl: z.string().describe('A data URI containing the generated box design image.'),
});
export type GenerateBoxDesignOutput = z.infer<typeof GenerateBoxDesignOutputSchema>;

export async function generateBoxDesign(input: GenerateBoxDesignInput): Promise<GenerateBoxDesignOutput> {
  return generateBoxDesignFlow(input);
}

const generateBoxDesignPrompt = ai.definePrompt({
  name: 'generateBoxDesignPrompt',
  input: {schema: GenerateBoxDesignInputSchema},
  output: {schema: GenerateBoxDesignOutputSchema},
  prompt: `You are an AI-powered box design generator. Based on the user's prompt, create a visually appealing and practical box design.

  Prompt: {{{prompt}}}

  First, describe the design in detail in the designDescription field.
  Then, generate a URL to an image depicting the design in the imageUrl field.`, 
});

const generateBoxDesignFlow = ai.defineFlow(
  {
    name: 'generateBoxDesignFlow',
    inputSchema: GenerateBoxDesignInputSchema,
    outputSchema: GenerateBoxDesignOutputSchema,
  },
  async input => {
    const {text} = await generateBoxDesignPrompt(input);

    const { media } = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {
      designDescription: text!,
      imageUrl: media!.url,
    };
  }
);
