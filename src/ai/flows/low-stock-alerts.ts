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
  alertMessage: z.string().describe('A message indicating the stock level status and reorder recommendation, including an explanation that considers market trends and demand.'),
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
  prompt: `You are an expert inventory analyst and supply chain consultant. Your task is to provide intelligent reorder recommendations that go beyond simple calculations.

Analyze the following product data, considering market demand, potential seasonality, and a safety stock buffer.

Product ID: {{{productId}}}
Current Stock: {{{currentStock}}}
Average Daily Sales: {{{averageDailySales}}}
Replenishment Lead Time (Days): {{{leadTimeDays}}}

1.  **Calculate the Reorder Point:** The reorder point should be the lead time demand (average daily sales * lead time) plus a safety stock. The safety stock should be at least a few days of sales, but you can suggest a larger buffer if you infer potential for increased demand.
2.  **Assess Stock Status:** Determine if the current stock is below this reorder point.
3.  **Provide an Alert Message:** If the stock is low, create a clear, actionable alert message. This message MUST explain the "why" behind your recommendation. For example, mention if you're accounting for a standard buffer, or if you're suggesting a higher quantity due to inferred market trends (e.g., "With summer approaching, demand for this item may increase").
4.  **Recommend Reorder Quantity:** Calculate a reorder quantity that not only replenishes the stock but also accounts for future sales and the safety buffer. A good target is to have enough stock to last through the lead time plus an additional 2-4 weeks.

Based on this expert analysis, is the product low on stock? What is the recommended reorder quantity and what is the detailed alert message explaining your reasoning? Respond using the schema provided.`,
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
