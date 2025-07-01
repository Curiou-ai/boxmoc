'use server';

/**
 * @fileOverview An AI agent for generating various designs based on user prompts.
 *
 * - generateDesign - A function that handles the design generation process.
 * - GenerateDesignInput - The input type for the generateDesign function.
 * - GenerateDesignOutput - The return type for the generateDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDesignInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the desired design.'),
});
export type GenerateDesignInput = z.infer<typeof GenerateDesignInputSchema>;

const GenerateDesignOutputSchema = z.object({
  designDescription: z.string().describe('A textual description of the generated design.'),
  imageUrl: z.string().describe('A data URI containing the generated design image.'),
});
export type GenerateDesignOutput = z.infer<typeof GenerateDesignOutputSchema>;

export async function generateDesign(input: GenerateDesignInput): Promise<GenerateDesignOutput> {
  return generateDesignFlow(input);
}

const generateDesignPrompt = ai.definePrompt({
  name: 'generateDesignPrompt',
  input: {schema: GenerateDesignInputSchema},
  output: {schema: GenerateDesignOutputSchema},
  prompt: `You are an AI-powered design generator. Based on the user's prompt, create a visually appealing and practical design. This could be for packaging, marketing materials like flyers or cards, engravings, or event promotions.

  Prompt: {{{prompt}}}

  First, describe the design in detail in the designDescription field.
  Then, generate a URL to an image depicting the design in the imageUrl field.`, 
});

const generateDesignFlow = ai.defineFlow(
  {
    name: 'generateDesignFlow',
    inputSchema: GenerateDesignInputSchema,
    outputSchema: GenerateDesignOutputSchema,
  },
  async input => {
    const {text} = await generateDesignPrompt(input);

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
