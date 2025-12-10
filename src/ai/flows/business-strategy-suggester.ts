'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Product, Transaction, Supplier } from '@/lib/types';

// Define input schema
const BusinessStrategyInputSchema = z.object({
  products: z.array(z.any()),
  transactions: z.array(z.any()),
  suppliers: z.array(z.any()),
});
type BusinessStrategyInput = z.infer<typeof BusinessStrategyInputSchema>;


// Define the main exported function
export async function suggestBusinessStrategy(
  input: BusinessStrategyInput
): Promise<string> {
  // If there's not enough data, return the specific message.
  if (input.products.length < 2 || input.transactions.length < 2) {
    return 'Not enough data to generate a reliable insight yet.';
  }
  return suggestStrategiesFlow(input);
}


// Define the prompt for the AI model
const suggestStrategiesPrompt = ai.definePrompt({
  name: 'suggestStrategiesPrompt',
  model: 'gemini-1.5-flash',
  input: { schema: BusinessStrategyInputSchema },
  output: { format: 'text' },
  prompt: `
    You are an expert business analyst and strategist for a growing e-commerce brand.
    Analyze the provided store data and generate a practical, actionable business strategy.
    The data includes product information, sales transactions, and supplier details.

    **Store Data:**
    - Products: {{{json products}}}
    - Transactions: {{{json transactions}}}
    - Suppliers: {{{json suppliers}}}

    **Your Task:**
    Generate a business strategy with the following structure. Be specific, data-driven, and avoid generic advice.

    - **📌 Executive Summary:** A short, clear overview of the current business state and key recommendations.
    - **📈 Sales & Marketing Strategy (Short-Term):** Immediate actions to boost sales.
    - **🚀 Sales & Growth Strategy (Long-Term):** Sustainable growth plans.
    - **💰 Pricing & Profit Suggestions:** Ideas for price adjustments, bundles, or promotions to improve margins.
    - **📦 Inventory Insights & Forecast:** Guidance on stock management, including items to reorder, discontinue, or promote, and a future forecast if trends are clear.
    - **🔍 Category-wise or Supplier-wise Notes:** Specific observations about product categories or supplier performance.

    Base all your insights directly on the data provided.
  `,
});

// Define the Genkit flow
const suggestStrategiesFlow = ai.defineFlow(
  {
    name: 'suggestStrategiesFlow',
    inputSchema: BusinessStrategyInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    const {output} = await suggestStrategiesPrompt(input);
    return output!;
  }
);
