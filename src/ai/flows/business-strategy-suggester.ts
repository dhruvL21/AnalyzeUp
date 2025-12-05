'use server';
/**
 * @fileOverview An AI flow for generating business growth strategies based on inventory and sales data.
 *
 * - suggestStrategies - A function that generates business growth suggestions.
 * - SuggestStrategiesInput - The input type for the suggestStrategies function.
 * - SuggestStrategiesOutput - The return type for the suggestStrategies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStrategiesInputSchema = z.object({
  totalInventoryValue: z.number().describe('The total monetary value of all products in stock.'),
  totalSales: z.number().describe('The total revenue from all sales in the observed period.'),
  topSellingProducts: z.array(z.object({ name: z.string(), unitsSold: z.number() })).describe('A list of the top-selling products and the number of units sold.'),
  lowStockItemCount: z.number().describe('The number of products that are currently low in stock.'),
  salesTrend: z.string().describe('A brief description of the sales trend over the last 12 months (e.g., "upward", "downward", "stable").')
});
export type SuggestStrategiesInput = z.infer<
  typeof SuggestStrategiesInputSchema
>;

const SuggestionSchema = z.object({
    title: z.string().describe("A short, catchy title for the strategy."),
    description: z.string().describe("A detailed explanation of the strategy, including the 'why' based on the provided data."),
    priority: z.enum(['High', 'Medium', 'Low']).describe("The priority of the suggestion.")
});

const SuggestStrategiesOutputSchema = z.object({
  strategies: z.array(SuggestionSchema).describe('A list of 2-3 actionable business growth strategies.'),
});
export type SuggestStrategiesOutput = z.infer<
  typeof SuggestStrategiesOutputSchema
>;

export async function suggestStrategies(
  input: SuggestStrategiesInput
): Promise<SuggestStrategiesOutput> {
  return suggestStrategiesFlow(input);
}

const suggestStrategiesPrompt = ai.definePrompt({
  name: 'suggestStrategiesPrompt',
  input: {schema: SuggestStrategiesInputSchema},
  output: {schema: SuggestStrategiesOutputSchema},
  prompt: `You are a world-class business consultant and data analyst for a growing e-commerce brand.
Your task is to analyze the following business snapshot and provide 2-3 actionable, insightful strategies to improve and grow the business.
For each strategy, provide a clear title, a detailed description explaining your reasoning based on the data, and a priority level (High, Medium, or Low).

Business Data Snapshot:
- Total Inventory Value: {{{totalInventoryValue}}}
- Total Sales Revenue: {{{totalSales}}}
- Number of Low Stock Items: {{{lowStockItemCount}}}
- Top Selling Products:
{{#each topSellingProducts}}
  - {{name}} ({{unitsSold}} units sold)
{{/each}}
- 12-Month Sales Trend: {{{salesTrend}}}

Based on this data, generate concrete strategies. For example:
- If top-selling items are frequently low in stock, suggest a strategy for improving supply chain or increasing reorder points for those specific items.
- If inventory value is high but sales are lagging, suggest a marketing campaign or bundle deal to move stock.
- If a certain category of products is selling well, suggest expanding that product line.

Be specific, data-driven, and creative in your recommendations.`,
});

const suggestStrategiesFlow = ai.defineFlow(
  {
    name: 'suggestStrategiesFlow',
    inputSchema: SuggestStrategiesInputSchema,
    outputSchema: SuggestStrategiesOutputSchema,
  },
  async input => {
    const {output} = await suggestStrategiesPrompt(input);
    return output!;
  }
);
