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

Q: How long does shipping take?
A: Shipping times vary by location and product, but typically take 7-14 business days after production is complete.
`;

const PRIVACY_POLICY = `
Boxmoc is committed to protecting your privacy. We collect information you provide to us, such as your name and email, to process your requests and manage your account. We do not sell your data. For more details, please contact our support team.
`;

const TERMS_CONDITIONS = `
By using Boxmoc, you agree to our terms of service. You are responsible for the content you create and must ensure it does not violate any copyright or trademark laws. Boxmoc provides the tools, but you own your designs. Subscriptions are billed monthly or annually.
`;

const COMPANY_INFO = `
About Boxmoc: We are an AI-powered design platform specializing in custom packaging, marketing materials, and promotional items.
Core Features:
- AI Design Generator: Create concepts from text prompts.
- Intuitive Editor: Add logos, text, and adjust layouts.
- 3D Preview: Real-time 3D models of your designs.
- Supply Chain: Integrated network for high-quality production and global shipping.
Services: Custom boxes, flyers, business cards, engravings, and event materials.
Target Audience: SMEs, e-commerce brands, event planners, and marketing teams.
Contact: info@boxmoc.com | +1 (234) 567-890 | 742 Evergreen Terrace, Springfield, OR.
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

const getCompanyInfo = ai.defineTool(
    {
        name: 'getCompanyInfo',
        description: 'Get information about the company, its services, features, and how to contact us.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => COMPANY_INFO
);


const transferToLiveAgent = ai.defineTool(
    {
        name: 'transferToLiveAgent',
        description: 'Transfers the user to a live support agent when the AI cannot answer the question or if the user asks for human help.',
        inputSchema: z.object({ query: z.string().describe('The user\'s original query to pass to the agent.') }),
        outputSchema: z.string(),
    },
    async ({ query }) => {
        console.log(`Transferring to live agent for query: ${query}`);
        return "I'm connecting you with a live support agent now. Please wait a moment.";
    }
);

const contactTeam = ai.defineTool(
    {
        name: 'contactTeam',
        description: 'Directs the user to the contact page or provides details on how to reach the support team for inquiries outside my current knowledge.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => {
        return "You can reach our support team directly by visiting our contact page at /contact or by emailing support@boxmoc.com. I am strictly authorized to help with inquiries related to our website content!";
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
  const isCreditExhausted = input.query.toLowerCase().includes('credit check fail');
  if (isCreditExhausted) {
      return "I'm sorry, but it looks like you've exhausted your AI credits for the month. Please upgrade your plan to continue.";
  }

  return chatbotFlow(input);
}

const systemPrompt = `You are a support assistant for Boxmoc. 
    Your ONLY function is to answer questions about Boxmoc's services, policies, and FAQs based strictly on the content of the webpage provided via your tools.

    Scope of coverage:
    - Boxmoc's services (packaging, marketing, events).
    - Features (AI generation, 3D preview, customization).
    - Frequently Asked Questions.
    - Company information and contact details.
    - Privacy Policy and Terms & Conditions.

    STRICT RULES:
    1. Only answer queries regarding the content mentioned above.
    2. If a user asks a question that is NOT related to Boxmoc or is outside the scope of your tools (e.g., general knowledge, personal advice, unrelated tasks), you MUST politely decline.
    3. When declining, you MUST explicitly inform the user that you can only assist with inquiries regarding Boxmoc's website content.
    4. For any out-of-scope query, or if the user requires human assistance, you MUST offer to redirect them to a live agent (using 'transferToLiveAgent') or suggest they visit the contact page (/contact).
    5. Do not hallucinate information not provided in the tools.
    
    Format your responses using Markdown.`;

const chatbotPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    input: { schema: ChatbotInputSchema },
    output: { format: 'text' },
    tools: [getFaq, getPrivacyPolicy, getTermsAndConditions, getCompanyInfo, transferToLiveAgent, contactTeam],
    system: `${systemPrompt}
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
    try {
        const { output } = await chatbotPrompt(input);
        return output as string;
    } catch (error) {
        console.warn('Gemini model failed, checking fallback.', error);
        
        const openAiUrl = process.env.OPENAI_API_URL;
        const openAiKey = process.env.OPENAI_API_KEY;

        if (!openAiUrl || !openAiKey) {
            return 'I am having trouble connecting to my knowledge base right now. Please try again in a moment.';
        }
        
        try {
            const messages = [
                { role: 'system', content: systemPrompt },
                ...(input.history || []).map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.content })),
                { role: 'user', content: input.query }
            ];

            const response = await fetch(openAiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openAiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: messages,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || 'Sorry, I am having trouble responding right now.';
            
        } catch (fallbackError) {
            console.error('Fallback model also failed.', fallbackError);
            return 'Sorry, I am having trouble connecting to my knowledge base right now. Please try again later.';
        }
    }
  }
);