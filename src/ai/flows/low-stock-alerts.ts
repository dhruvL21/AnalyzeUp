
'use server';

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

/* ----------------------------- INPUT SCHEMA ----------------------------- */

const AIStockAdvisorInputSchema = z.object({
  productName: z.string(),
  averageDailySales: z.number(),
  supplierLeadTimeDays: z.number(),
  currentStockLevel: z.number(),
});

export type AIStockAdvisorInput = z.infer<
  typeof AIStockAdvisorInputSchema
>;

/* ----------------------------- OUTPUT SCHEMA ----------------------------- */

const AIStockAdvisorOutputSchema = z.object({
  stockoutRisk: z.boolean(),
  recommendedReorderQuantity: z.number(),
  reasoning: z.string(),
});

export type AIStockAdvisorOutput = z.infer<
  typeof AIStockAdvisorOutputSchema
>;

/* ----------------------------- PROMPT ----------------------------- */

const aiStockAdvisorPrompt = ai.definePrompt({
  name: 'aiStockAdvisorPrompt',
  input: { schema: AIStockAdvisorInputSchema },
  output: { schema: AIStockAdvisorOutputSchema },
  model: googleAI('gemini-1.5-flash-latest'),
  prompt: `
You are an AI inventory management assistant.

Analyze the product data below and determine:
1. Whether the product is at risk of stocking out
2. The recommended reorder quantity

Product Name: {{{productName}}}
Average Daily Sales: {{{averageDailySales}}}
Supplier Lead Time (Days): {{{supplierLeadTimeDays}}}
Current Stock Level: {{{currentStockLevel}}}

Guidelines:
- Calculate demand during lead time
- Add reasonable safety stock
- Avoid excess inventory

Respond ONLY in valid JSON.
`,
});

/* ----------------------------- FLOW ----------------------------- */

const aiStockAdvisorFlow = ai.defineFlow(
  {
    name: 'aiStockAdvisorFlow',
    inputSchema: AIStockAdvisorInputSchema,
    outputSchema: AIStockAdvisorOutputSchema,
  },
  async (input) => {
    const response = await aiStockAdvisorPrompt(input);

    if (!response.output) {
      throw new Error('No output returned from Gemini');
    }

    return response.output;
  }
);

/* ----------------------------- EXPORT ----------------------------- */

export async function aiStockAdvisor(
  input: AIStockAdvisorInput
): Promise<AIStockAdvisorOutput> {
  return aiStockAdvisorFlow(input);
}
