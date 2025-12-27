
'use server';

/**
 * @fileOverview This file defines the AI Sales Strategy flow, which analyzes sales and product data to generate a business growth strategy.
 *
 * - generateSalesStrategy - A function that generates a sales strategy based on input data.
 * - SalesStrategyInput - The input type for the generateSalesStrategy function.
 * - SalesStrategyOutput - The return type for the generateSalesStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const SalesStrategyInputSchema = z.object({
  salesData: z
    .string()
    .describe('Sales data, including revenue, product performance, and customer demographics.'),
  productData: z.string().describe('Product data, including cost, inventory levels, and descriptions.'),
  marketTrends: z
    .string()
    .optional()
    .describe('Optional data about current market trends relevant to the business.'),
});
export type SalesStrategyInput = z.infer<typeof SalesStrategyInputSchema>;

const SalesStrategyOutputSchema = z.object({
  strategySummary: z.string().describe('A concise summary of the business growth strategy.'),
  keyRecommendations: z.string().describe('Key recommendations for implementing the strategy.'),
  potentialRisks: z.string().describe('Potential risks associated with the strategy.'),
  expectedOutcomes: z.string().describe('Expected outcomes of implementing the strategy.'),
});
export type SalesStrategyOutput = z.infer<typeof SalesStrategyOutputSchema>;

export async function generateSalesStrategy(input: SalesStrategyInput): Promise<SalesStrategyOutput> {
  return aiSalesStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSalesStrategyPrompt',
  input: {schema: SalesStrategyInputSchema},
  output: {schema: SalesStrategyOutputSchema},
  model: googleAI.model('gemini-1.5-flash-001'),
  prompt: `You are a business strategy consultant. Analyze the provided sales, product, and market data to generate a business growth strategy.

Sales Data: {{{salesData}}}
Product Data: {{{productData}}}
Market Trends (Optional): {{{marketTrends}}}

Based on this data, provide the following:

1.  A concise strategy summary.
2.  Key recommendations for implementation.
3.  Potential risks associated with the strategy.
4.  Expected outcomes of implementing the strategy.

Ensure the strategy is actionable and realistic, given the available data.`,
});

const aiSalesStrategyFlow = ai.defineFlow(
  {
    name: 'aiSalesStrategyFlow',
    inputSchema: SalesStrategyInputSchema,
    outputSchema: SalesStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
