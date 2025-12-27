
// 'use server';

// import { ai } from '@/ai/genkit';
// import { googleAI } from '@genkit-ai/google-genai';
// import { z } from 'genkit';

// /* ----------------------------- INPUT SCHEMA ----------------------------- */

// const AIStockAdvisorInputSchema = z.object({
//   productName: z.string(),
//   averageDailySales: z.number(),
//   supplierLeadTimeDays: z.number(),
//   currentStockLevel: z.number(),
// });

// export type AIStockAdvisorInput = z.infer<
//   typeof AIStockAdvisorInputSchema
// >;

// /* ----------------------------- OUTPUT SCHEMA ----------------------------- */

// const AIStockAdvisorOutputSchema = z.object({
//   stockoutRisk: z.boolean(),
//   recommendedReorderQuantity: z.number(),
//   reasoning: z.string(),
// });

// export type AIStockAdvisorOutput = z.infer<
//   typeof AIStockAdvisorOutputSchema
// >;

// /* ----------------------------- PROMPT ----------------------------- */

// const aiStockAdvisorPrompt = ai.definePrompt({
//   name: 'aiStockAdvisorPrompt',
//   input: { schema: AIStockAdvisorInputSchema },
//   output: { schema: AIStockAdvisorOutputSchema },
//   model: googleAI('gemini-1.5-flash-latest'),
//   prompt: `
// You are an AI inventory management assistant.

// Analyze the product data below and determine:
// 1. Whether the product is at risk of stocking out
// 2. The recommended reorder quantity

// Product Name: {{{productName}}}
// Average Daily Sales: {{{averageDailySales}}}
// Supplier Lead Time (Days): {{{supplierLeadTimeDays}}}
// Current Stock Level: {{{currentStockLevel}}}

// Guidelines:
// - Calculate demand during lead time
// - Add reasonable safety stock
// - Avoid excess inventory

// Respond ONLY in valid JSON.
// `,
// });

// /* ----------------------------- FLOW ----------------------------- */

// const aiStockAdvisorFlow = ai.defineFlow(
//   {
//     name: 'aiStockAdvisorFlow',
//     inputSchema: AIStockAdvisorInputSchema,
//     outputSchema: AIStockAdvisorOutputSchema,
//   },
//   async (input) => {
//     const response = await aiStockAdvisorPrompt(input);

//     if (!response.output) {
//       throw new Error('No output returned from Gemini');
//     }

//     return response.output;
//   }
// );

// /* ----------------------------- EXPORT ----------------------------- */

// export async function aiStockAdvisor(
//   input: AIStockAdvisorInput
// ): Promise<AIStockAdvisorOutput> {
//   return aiStockAdvisorFlow(input);
// }


'use server';

/**
 * @fileOverview This file implements the AI Stock Advisor flow, which analyzes sales data
 * and supplier lead times to identify products at risk of stocking out and recommend
 * a reorder quantity.
 *
 * @exports aiStockAdvisor - A function that takes product and sales data to predict stockouts and suggest reorder quantities.
 * @exports AIStockAdvisorInput - The input type for the aiStockAdvisor function.
 * @exports AIStockAdvisorOutput - The return type for the aiStockAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIStockAdvisorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  averageDailySales: z
    .number()
    .describe('The average daily sales volume of the product.'),
  supplierLeadTimeDays: z
    .number()
    .describe('The number of days it takes for the supplier to deliver the product.'),
  currentStockLevel: z.number().describe('The current stock level of the product.'),
});
export type AIStockAdvisorInput = z.infer<typeof AIStockAdvisorInputSchema>;

const AIStockAdvisorOutputSchema = z.object({
  stockoutRisk: z
    .boolean()
    .describe('Whether the product is at risk of stocking out.'),
  recommendedReorderQuantity: z
    .number()
    .describe('The recommended reorder quantity to prevent stockouts.'),
  reasoning: z.string().describe('The AI reasoning behind the reorder quantity.'),
});
export type AIStockAdvisorOutput = z.infer<typeof AIStockAdvisorOutputSchema>;

export async function aiStockAdvisor(input: AIStockAdvisorInput): Promise<AIStockAdvisorOutput> {
  return aiStockAdvisorFlow(input);
}

const aiStockAdvisorPrompt = ai.definePrompt({
  name: 'aiStockAdvisorPrompt',
  input: {schema: AIStockAdvisorInputSchema},
  output: {schema: AIStockAdvisorOutputSchema},
  prompt: `You are an AI assistant that analyzes sales data and supplier lead times to determine if a product is at risk of stocking out and recommends a reorder quantity.

  Analyze the following data to determine the stockout risk and suggest a reorder quantity:

  Product Name: {{{productName}}}
  Average Daily Sales: {{{averageDailySales}}}
  Supplier Lead Time (Days): {{{supplierLeadTimeDays}}}
  Current Stock Level: {{{currentStockLevel}}}

  Consider the following factors when determining the reorder quantity:
  - Safety stock to account for unexpected demand fluctuations
  - The goal of preventing stockouts while minimizing excess inventory

  Return the results in JSON format.
  Include your reasoning for the reorder quantity.
`,
});

const aiStockAdvisorFlow = ai.defineFlow(
  {
    name: 'aiStockAdvisorFlow',
    inputSchema: AIStockAdvisorInputSchema,
    outputSchema: AIStockAdvisorOutputSchema,
  },
  async input => {
    const {output} = await aiStockAdvisorPrompt(input);
    return output!;
  }
);
