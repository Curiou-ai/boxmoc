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

const COMPANY_INFO = `
About Boxmoc: We are a design platform that makes it easy to create stunning, custom designs for packaging, marketing materials, and events using AI.
Services: We offer AI design generation, an intuitive design editor, 3D previews, and project management. We can create designs for custom packaging, flyers, cards, engravings, and event promotions.
Contact: You can reach us at contact@boxmoc.com or call us at +1 (234) 567-890.
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
        description: 'Get information about the company, its services, and how to contact us. Use this if the user asks for the company email or phone number.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => COMPANY_INFO
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

const contactTeam = ai.defineTool(
    {
        name: 'contactTeam',
        description: 'Use this when the user wants to contact the support team, file a support ticket, or send a message to the company for non-live-chat inquiries.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => {
        // This response guides the user to provide the necessary information for the contact request.
        // The AI will then process the user's next message containing these details.
        return "I can help with that. To create a support ticket for you, please provide your full name, email address, and a brief message outlining your request. I'll make sure it gets to the right team.";
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

  // Check if the user's query contains contact information, likely in response to the contactTeam tool.
  const containsContactInfo = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(input.query) && input.query.length > 30;
  const lastBotMessage = input.history?.slice(-1).find(m => m.role === 'model')?.content;

  if (containsContactInfo && lastBotMessage?.includes("create a support ticket")) {
    console.log(`--- New Contact Request from Chatbot ---`);
    console.log(`Query: ${input.query}`);
    console.log(`------------------------------------`);
    return "Thank you! I've forwarded your message to our team. They will get back to you at the email address you provided shortly.";
  }

  return chatbotFlow(input);
}

const systemPrompt = `You are a support assistant for Boxmoc.
    Your ONLY function is to answer questions about Boxmoc's services, policies, and FAQs using the provided tools.
    - Use 'getCompanyInfo' for questions about what Boxmoc does, its services, or how to contact us (e.g., if a user asks for the company email or phone number).
    - Use 'getFaq' for frequently asked questions.
    - Use 'getPrivacyPolicy' for privacy-related questions.
    - Use 'getTermsAndConditions' for questions about terms of service.
    - Use 'contactTeam' if the user explicitly wants to send a message, file a support ticket, or contact the team for non-urgent matters.
    
    If a user asks a question that is not related to Boxmoc or cannot be answered with your tools, you MUST politely decline. Respond with something like: "I can only answer questions about Boxmoc. How can I help you with our services?"
    
    Do not invent information or answer general knowledge questions.

    Format your responses using Markdown. Use paragraphs for longer blocks of text. For lists of items, use bullet points (e.g., using '*' or '-').
    
    If the user asks to speak to a person or agent, use the 'transferToLiveAgent' tool.`;

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
        // Use the ai object to access the configured model and generate content
        const { output } = await chatbotPrompt(input);
        return output as string;
    } catch (error) {
        console.warn('Gemini model failed, switching to OpenAI fallback.', error);
        try {
            const openAiUrl = process.env.OPENAI_API_URL ?? '';
            const openAiKey = process.env.OPENAI_API_KEY ?? '';

            if (!openAiUrl && !openAiKey) {
                throw new Error("OpenAI environment variables are not set.");
            }
            
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
                    // Note: Tools are defined for Genkit and won't work here directly.
                    // The prompt instructs the model on how to behave, but it can't call the Genkit tools.
                    // For a true fallback, you might need a separate prompt or logic here.
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || 'Sorry, the fallback model could not provide a response.';
            
        } catch (fallbackError) {
            console.error('OpenAI fallback model also failed.', fallbackError);
            return 'Sorry, I am having trouble connecting to my knowledge base right now. Please try again later.';
        }
    }
  }
);
