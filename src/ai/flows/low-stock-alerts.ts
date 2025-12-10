
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductInfoSchema = z.object({
  name: z.string(),
  stock: z.number(),
  averageDailySales: z.number(),
  leadTimeDays: z.number(),
});

export const LowStockInputSchema = z.object({
  products: z.array(ProductInfoSchema),
});

const LowStockProductSchema = z.object({
    productName: z.string(),
    currentStock: z.number(),
    predictedDemand: z.string().describe("Predicted weekly demand for the product."),
    reorderSuggestion: z.number().describe("The suggested quantity to reorder."),
});

export type lowStockProduct = z.infer<typeof LowStockProductSchema>;

const LowStockOutputSchema = z.object({
    lowStockProducts: z.array(LowStockProductSchema),
});


const lowStockPrompt = ai.definePrompt({
    name: 'lowStockPrompt',
    input: { schema: LowStockInputSchema },
    output: { schema: LowStockOutputSchema },
    prompt: `You are an expert inventory management AI. Analyze the following product data to identify items that are at risk of stocking out soon.

Product Data: {{{json products}}}

For each product, consider its current stock, average daily sales, and supplier lead time. A product is at risk if its (stock / averageDailySales) is less than its leadTimeDays + a 3-day buffer.

Calculate the predicted weekly demand (averageDailySales * 7).

Recommend a reorder quantity to cover 4 weeks of sales (averageDailySales * 28).

Only return products that are identified as low stock. If no products are low stock, return an empty array.
`,
});


const lowStockAlertsFlow = ai.defineFlow(
    {
        name: 'lowStockAlertsFlow',
        inputSchema: LowStockInputSchema,
        outputSchema: LowStockOutputSchema,
    },
    async (input) => {
        const { output } = await lowStockPrompt(input);
        if (!output) {
            return { lowStockProducts: [] };
        }
        return output;
    }
);


export async function getLowStockSuggestions(
    input: z.infer<typeof LowStockInputSchema>
): Promise<z.infer<typeof LowStockOutputSchema>> {
    return await lowStockAlertsFlow(input);
}
