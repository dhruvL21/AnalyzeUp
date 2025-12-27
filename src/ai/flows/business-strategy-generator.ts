
// 'use server';

// /**
//  * @fileOverview This file defines the AI Sales Strategy flow, which analyzes sales and product data to generate a business growth strategy.
//  *
//  * - generateSalesStrategy - A function that generates a sales strategy based on input data.
//  * - SalesStrategyInput - The input type for the generateSalesStrategy function.
//  * - SalesStrategyOutput - The return type for the generateSalesStrategy function.
//  */

// import {ai} from '@/ai/genkit';
// import {z} from 'genkit';
// import { googleAI } from '@genkit-ai/google-genai';

// const SalesStrategyInputSchema = z.object({
//   salesData: z
//     .string()
//     .describe('Sales data, including revenue, product performance, and customer demographics.'),
//   productData: z.string().describe('Product data, including cost, inventory levels, and descriptions.'),
//   marketTrends: z
//     .string()
//     .optional()
//     .describe('Optional data about current market trends relevant to the business.'),
// });
// export type SalesStrategyInput = z.infer<typeof SalesStrategyInputSchema>;

// const SalesStrategyOutputSchema = z.object({
//   strategySummary: z.string().describe('A concise summary of the business growth strategy.'),
//   keyRecommendations: z.string().describe('Key recommendations for implementing the strategy.'),
//   potentialRisks: z.string().describe('Potential risks associated with the strategy.'),
//   expectedOutcomes: z.string().describe('Expected outcomes of implementing the strategy.'),
// });
// export type SalesStrategyOutput = z.infer<typeof SalesStrategyOutputSchema>;

// export async function generateSalesStrategy(input: SalesStrategyInput): Promise<SalesStrategyOutput> {
//   return aiSalesStrategyFlow(input);
// }

// const prompt = ai.definePrompt({
//   name: 'aiSalesStrategyPrompt',
//   input: {schema: SalesStrategyInputSchema},
//   output: {schema: SalesStrategyOutputSchema},
//   model: googleAI('gemini-1.5-flash-latest'),
//   prompt: `You are a business strategy consultant. Analyze the provided sales, product, and market data to generate a business growth strategy.

// Sales Data: {{{salesData}}}
// Product Data: {{{productData}}}
// Market Trends (Optional): {{{marketTrends}}}

// Based on this data, provide the following:

// 1.  A concise strategy summary.
// 2.  Key recommendations for implementation.
// 3.  Potential risks associated with the strategy.
// 4.  Expected outcomes of implementing the strategy.

// Ensure the strategy is actionable and realistic, given the available data.`,
// });

// const aiSalesStrategyFlow = ai.defineFlow(
//   {
//     name: 'aiSalesStrategyFlow',
//     inputSchema: SalesStrategyInputSchema,
//     outputSchema: SalesStrategyOutputSchema,
//   },
//   async input => {
//     const {output} = await prompt(input);
//     return output!;
//   }
// );



'use server';

/**
 * @fileOverview AI Business Strategy Generator
 * Generates a detailed, actionable business growth strategy based on sales, product, and market data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/* -------------------- INPUT SCHEMA -------------------- */

const BusinessStrategyInputSchema = z.object({
  salesData: z.string().describe('Detailed sales data including revenue, product performance, and customer demographics.'),
  productData: z.string().describe('Detailed product data including cost, inventory levels, features, and descriptions.'),
  marketTrends: z.string().optional().describe('Optional information about current market trends relevant to the business.'),
});

export type BusinessStrategyInput = z.infer<typeof BusinessStrategyInputSchema>;

/* -------------------- OUTPUT SCHEMA -------------------- */

const BusinessStrategyOutputSchema = z.object({
  strategySummary: z.string().describe('A concise summary of the proposed business growth strategy.'),
  keyRecommendations: z.string().describe('Clear, actionable recommendations for executing the strategy.'),
  potentialRisks: z.string().describe('Possible risks and challenges associated with the strategy.'),
  expectedOutcomes: z.string().describe('Expected results and benefits from implementing the strategy.'),
});

export type BusinessStrategyOutput = z.infer<typeof BusinessStrategyOutputSchema>;

/* -------------------- PROMPT DEFINITION -------------------- */

const businessStrategyPrompt = ai.definePrompt({
  name: 'businessStrategyPrompt',
  input: { schema: BusinessStrategyInputSchema },
  output: { schema: BusinessStrategyOutputSchema },
  prompt: `
You are a seasoned business consultant tasked with creating a comprehensive business growth strategy.

Analyze the data provided below carefully:

Sales Data:
{{{salesData}}}

Product Data:
{{{productData}}}

Market Trends (if available):
{{{marketTrends}}}

Based on this information, generate:

1. A concise summary of the overall business strategy.
2. Key actionable recommendations to implement the strategy successfully.
3. Potential risks or obstacles the business might face.
4. Expected outcomes and impact of the strategy when executed effectively.

Focus on practicality and relevance, ensuring the strategy aligns with the data provided.
Respond only in clear, structured JSON matching the output schema.
`,
});

/* -------------------- FLOW DEFINITION -------------------- */

const businessStrategyFlow = ai.defineFlow(
  {
    name: 'businessStrategyFlow',
    inputSchema: BusinessStrategyInputSchema,
    outputSchema: BusinessStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await businessStrategyPrompt(input);

    if (!output) {
      throw new Error('No output received from the AI model.');
    }

    return output;
  }
);

/* -------------------- EXPORT FUNCTION -------------------- */

export async function generateBusinessStrategy(
  input: BusinessStrategyInput
): Promise<BusinessStrategyOutput> {
  return businessStrategyFlow(input);
}
