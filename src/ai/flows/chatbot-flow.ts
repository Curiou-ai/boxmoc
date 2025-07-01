'use server';
/**
 * @fileOverview A chatbot flow for handling user queries.
 *
 * - askChatbot - A function that handles chatbot interactions.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Static data for tools
const FAQ_DATA = `
Q: What can I design with Boxmoc?
A: You can design a wide range of items, including custom packaging, marketing materials like flyers and cards, engravings, and event promotions.

Q: How does the AI design generation work?
A: You provide a text prompt describing your idea, and our AI generates design concepts for you. You can then customize these designs.

Q: Can I talk to a real person?
A: Yes, if the AI cannot answer your question, you can ask to be transferred to a live support agent.
`;

const PRIVACY_POLICY = `
Boxmoc is committed to protecting your privacy. We collect information you provide to us, such as your name and email, to process your requests. We do not sell your data. For more details, please contact our support team.
`;

const TERMS_CONDITIONS = `
By using Boxmoc, you agree to our terms of service. You are responsible for the content you create and must ensure it does not violate any copyright or trademark laws. Boxmoc provides the tools, but you own your designs.
`;

// Tools definition
const getFaq = ai.defineTool(
    {
        name: 'getFaq',
        description: 'Get frequently asked questions and answers about Boxmoc.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => FAQ_DATA
);

const getPrivacyPolicy = ai.defineTool(
    {
        name: 'getPrivacyPolicy',
        description: 'Get the privacy policy information for Boxmoc.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => PRIVACY_POLICY
);

const getTermsAndConditions = ai.defineTool(
    {
        name: 'getTermsAndConditions',
        description: 'Get the terms and conditions for using Boxmoc.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => TERMS_CONDITIONS
);

const transferToLiveAgent = ai.defineTool(
    {
        name: 'transferToLiveAgent',
        description: 'Transfers the user to a live support agent when the AI cannot answer the question.',
        inputSchema: z.object({ query: z.string().describe('The user\'s original query to pass to the agent.') }),
        outputSchema: z.string(),
    },
    async ({ query }) => {
        console.log(`Transferring to live agent for query: ${query}`);
        return "I'm connecting you with a live support agent now. Please wait a moment.";
    }
);


const ChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
  query: z.string().describe('The user\'s current question or message.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.string();
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function askChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  // A simple mechanism to simulate exhausted credits. In a real app, this would be a database check.
  const isCreditExhausted = input.query.toLowerCase().includes('credit check fail');
  if (isCreditExhausted) {
      return "I'm sorry, but it looks like you've exhausted your AI credits for the month. Please upgrade your plan to continue.";
  }

  return chatbotFlow(input);
}


const chatbotPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    input: { schema: ChatbotInputSchema },
    output: { format: 'text' },
    tools: [getFaq, getPrivacyPolicy, getTermsAndConditions, transferToLiveAgent],
    system: `You are a friendly and helpful support assistant for Boxmoc, a design platform.
    Your goal is to answer user questions about the platform, help them with their design needs, and provide support.
    Use the available tools to answer questions about FAQs, privacy, or terms.
    If you cannot answer a question or the user asks to speak to a person, use the 'transferToLiveAgent' tool.
    Keep your answers concise and helpful.
    Here is the conversation history:
    {{#if history}}
      {{#each history}}
        {{role}}: {{content}}
      {{/each}}
    {{/if}}
    `,
    prompt: `User: {{{query}}}`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await chatbotPrompt(input);
    return output as string;
  }
);
