'use server';

/**
 * @fileOverview Implements a low stock alert system that notifies warehouse managers when stock levels
 * fall below a dynamically calculated threshold based on sales history.
 *
 * - `getLowStockAlerts` -  A function to retrieve low stock alerts for a product.
 * - `LowStockAlertsInput` - The input type for the `getLowStockAlerts` function.
 * - `LowStockAlertsOutput` - The return type for the `getLowStockAlerts` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LowStockAlertsInputSchema = z.object({
  productId: z.string().describe('The ID of the product to check stock levels for.'),
  currentStock: z.number().describe('The current stock level of the product.'),
  averageDailySales: z.number().describe('The average daily sales volume of the product.'),
  leadTimeDays: z.number().describe('The lead time in days required to replenish the product.'),
});
export type LowStockAlertsInput = z.infer<typeof LowStockAlertsInputSchema>;

const LowStockAlertsOutputSchema = z.object({
  isLowStock: z.boolean().describe('Whether the product is below the calculated low stock threshold.'),
  alertMessage: z.string().describe('A message indicating the stock level status and reorder recommendation.'),
  reorderQuantity: z.number().optional().describe('Recommended reorder quantity based on lead time and sales.'),
});
export type LowStockAlertsOutput = z.infer<typeof LowStockAlertsOutputSchema>;

export async function getLowStockAlerts(input: LowStockAlertsInput): Promise<LowStockAlertsOutput> {
  return lowStockAlertsFlow(input);
}

const lowStockAlertsPrompt = ai.definePrompt({
  name: 'lowStockAlertsPrompt',
  input: {schema: LowStockAlertsInputSchema},
  output: {schema: LowStockAlertsOutputSchema},
  prompt: `You are a warehouse inventory management expert.  Based on the current stock level, average daily sales, and lead time for a product, determine if a low stock alert should be triggered and provide a reorder recommendation.  Calculate the low stock threshold as the (average daily sales * lead time days) + (average daily sales * 2), which will cover the lead time period and a buffer of 2 days.

Product ID: {{{productId}}}
Current Stock: {{{currentStock}}}
Average Daily Sales: {{{averageDailySales}}}
Lead Time (Days): {{{leadTimeDays}}}

Consider a product low stock if current stock is less than the low stock threshold. The reorder quantity should bring the stock level up to approximately 1.5x the low stock threshold.

Based on this, is the product low stock?  What alert message should be displayed? What is the reorder quantity? Respond using the schema provided.`,
});

const lowStockAlertsFlow = ai.defineFlow(
  {
    name: 'lowStockAlertsFlow',
    inputSchema: LowStockAlertsInputSchema,
    outputSchema: LowStockAlertsOutputSchema,
  },
  async input => {
    const {output} = await lowStockAlertsPrompt(input);
    return output!;
  }
);
