
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { LowStockInputSchema, LowStockOutputSchema } from '@/lib/types.zod';
import { googleAI } from '@genkit-ai/google-genai';

export type lowStockProduct = z.infer<typeof import('@/lib/types.zod').LowStockProductSchema>;

const lowStockPrompt = ai.definePrompt({
    name: 'lowStockPrompt',
    model: 'gemini-pro',
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
