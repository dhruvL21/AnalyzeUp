
'use server';
/**
 * @fileOverview A Genkit flow for generating low stock alerts and reorder suggestions.
 * This flow analyzes a list of products, identifies those with low stock, and uses
 * AI to generate intelligent reorder suggestions based on sales velocity and lead time.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

// Simplified product schema for the flow input
const ProductInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  stock: z.number(),
  averageDailySales: z.number().optional().default(1),
  leadTimeDays: z.number().optional().default(7),
});

// Schema for the overall input to the flow
const LowStockInputSchema = z.object({
  products: z.array(ProductInputSchema),
});
export type LowStockInput = z.infer<typeof LowStockInputSchema>;

// Schema for a single AI-generated suggestion
const LowStockSuggestionSchema = z.object({
  productId: z.string().describe('The unique identifier of the product.'),
  productName: z.string().describe('The name of the product.'),
  currentStock: z.number().describe('The current stock level of the product.'),
  suggestion: z.string().describe('The AI-generated reorder suggestion and reasoning.'),
});
export type LowStockSuggestion = z.infer<typeof LowStockSuggestionSchema>;

// Schema for the flow's final output
const LowStockOutputSchema = z.object({
  suggestions: z.array(LowStockSuggestionSchema),
});
export type LowStockOutput = z.infer<typeof LowStockOutputSchema>;


/**
 * An exported wrapper function that calls the Genkit flow.
 * This makes it easy to invoke the flow from other parts of the application.
 * @param input An object containing the list of products to analyze.
 * @returns A promise that resolves to an array of low stock suggestions.
 */
export async function getLowStockSuggestions(input: LowStockInput): Promise<LowStockOutput> {
  return lowStockAlertsFlow(input);
}


// Define the prompt that will be sent to the AI model.
const lowStockPrompt = ai.definePrompt(
  {
    name: 'lowStockAlertPrompt',
    input: { schema: LowStockInputSchema },
    output: { schema: LowStockOutputSchema },
    prompt: `
      You are an expert inventory management AI. Your task is to analyze a list of products that are low in stock
      and provide a reorder suggestion for each one.
      
      For each product, consider the following information:
      - Current Stock: The number of units currently available.
      - Average Daily Sales: The average number of units sold per day.
      - Lead Time (days): The number of days it takes for new stock to arrive from the supplier.

      Your suggestion should be a short, actionable sentence.
      For example: "Reorder 50 units now to cover the next 2 weeks of sales and lead time."
      
      Here is the list of low-stock products:
      
      {{#each products}}
      - Product ID: {{{id}}}
      - Product Name: {{{name}}}
      - Current Stock: {{{stock}}}
      - Average Daily Sales: {{{averageDailySales}}}
      - Lead Time (days): {{{leadTimeDays}}}
      ---
      {{/each}}
      
      Generate a list of suggestions based on this data.
    `,
    model: 'gemini-1.5-flash',
  },
);

// Define the Genkit flow that orchestrates the AI call.
const lowStockAlertsFlow = ai.defineFlow(
  {
    name: 'lowStockAlertsFlow',
    inputSchema: LowStockInputSchema,
    outputSchema: LowStockOutputSchema,
  },
  async (input) => {
    // Identify products with stock less than a threshold (e.g., 20)
    const lowStockProducts = input.products.filter(p => p.stock < 20);

    if (lowStockProducts.length === 0) {
      return { suggestions: [] };
    }
    
    const { output } = await lowStockPrompt({ products: lowStockProducts });
    if (!output) {
      throw new Error('Failed to generate low stock suggestions.');
    }
    return output;
  }
);
