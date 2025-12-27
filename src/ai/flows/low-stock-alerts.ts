
'use server';

/**
 * @fileOverview AI Stock Advisor Flow
 * Analyzes sales data and supplier lead times to identify stockout risks
 * and recommend reorder quantities.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/* ----------------------------- INPUT SCHEMA ----------------------------- */

const AIStockAdvisorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  averageDailySales: z
    .number()
    .describe('The average daily sales volume of the product.'),
  supplierLeadTimeDays: z
    .number()
    .describe('The number of days it takes for the supplier to deliver the product.'),
  currentStockLevel: z
    .number()
    .describe('The current stock level of the product.'),
});

export type AIStockAdvisorInput = z.infer<
  typeof AIStockAdvisorInputSchema
>;

/* ----------------------------- OUTPUT SCHEMA ----------------------------- */

const AIStockAdvisorOutputSchema = z.object({
  stockoutRisk: z
    .boolean()
    .describe('Whether the product is at risk of stocking out.'),
  recommendedReorderQuantity: z
    .number()
    .describe('The recommended reorder quantity to prevent stockouts.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the reorder quantity.'),
});

export type AIStockAdvisorOutput = z.infer<
  typeof AIStockAdvisorOutputSchema
>;

/* ----------------------------- PROMPT ----------------------------- */

const aiStockAdvisorPrompt = ai.definePrompt({
  name: 'aiStockAdvisorPrompt',
  input: {
    schema: AIStockAdvisorInputSchema,
  },
  output: {
    schema: AIStockAdvisorOutputSchema,
  },
  model: googleAI('gemini-1.5-flash-latest'),
  prompt: `
You are an AI inventory management assistant.

Analyze the following product data and determine:
1. Whether the product is at risk of stocking out
2. The recommended reorder quantity

Product Name: {{{productName}}}
Average Daily Sales: {{{averageDailySales}}}
Supplier Lead Time (Days): {{{supplierLeadTimeDays}}}
Current Stock Level: {{{currentStockLevel}}}

Guidelines:
- Calculate expected demand during lead time
- Add reasonable safety stock
- Avoid excessive inventory

Respond ONLY in valid JSON matching the output schema.
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
      throw new Error('No output received from Gemini model');
    }

    return response.output;
  }
);

/* ----------------------------- EXPORT FUNCTION ----------------------------- */

export async function aiStockAdvisor(
  input: AIStockAdvisorInput
): Promise<AIStockAdvisorOutput> {
  return aiStockAdvisorFlow(input);
}
