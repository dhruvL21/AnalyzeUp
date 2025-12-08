
'use server';
/**
 * @fileOverview This file defines the AI flow for the Smart Restock Assistant.
 *
 * - getRestockSuggestion - A server action that analyzes a product's performance and suggests a reorder quantity.
 */
import {z} from 'zod';
import {ai} from '@/ai/genkit';
import {ProductSchema, TransactionSchema} from '@/lib/types.zod';
import { googleAI } from '@genkit-ai/google-genai';

const LowStockAlertInputSchema = z.object({
  product: ProductSchema,
  transactions: z.array(TransactionSchema),
});

const LowStockAlertOutputSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().describe('The ID of the product.'),
      name: z.string().describe('The name of the product.'),
      status: z
        .enum(['LOW', 'OK', 'OVERSTOCKED'])
        .describe('The current stock status.'),
      suggestedReorderQty: z
        .number()
        .describe('The suggested quantity to reorder.'),
      expectedDaysOfCover: z
        .number()
        .describe(
          'The estimated number of days the current and reordered stock will last.'
        ),
      reason: z
        .string()
        .describe('A short explanation for the suggestion.'),
    })
  ),
});

type LowStockAlertInput = z.infer<typeof LowStockAlertInputSchema>;
type LowStockAlertOutput = z.infer<typeof LowStockAlertOutputSchema>;

export async function getRestockSuggestion(
  input: LowStockAlertInput
): Promise<LowStockAlertOutput> {
  return lowStockAlertsFlow(input);
}

const lowStockAlertsPrompt = ai.definePrompt({
  name: 'lowStockAlertsPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: LowStockAlertInputSchema},
  output: {schema: LowStockAlertOutputSchema},
  prompt: `
You are an AI Smart Restock Assistant for an inventory management system. Your task is to analyze a single product's data and provide a restock suggestion in JSON format.

**Your Analysis Must Consider:**
- **Average Sales:** Calculate the average daily/weekly sales from the transaction history.
- **Sales Trend:** Is demand for this product rising, falling, or stable?
- **Lead Time:** Use the product's \`leadTimeDays\`. If missing, assume 7 days.
- **Safety Stock:** Maintain a safety buffer. A good default is 20-30% of demand during lead time.

**Rules for Suggestions:**
- If a product has no sales history or a clear negative trend, be cautious. Do not recommend a large reorder unless there's a good reason.
- The \`suggestedReorderQty\` should be a practical number.
- Provide a concise, clear \`reason\` for your recommendation.

**Product & Transaction Data:**
- **Product to Analyze:**
  \`\`\`json
  {{{json product}}}
  \`\`\`
- **Recent Transactions for this Product:**
  \`\`\`json
  {{{json transactions}}}
  \`\`\`

---

**Required Output Format (JSON only):**
You must respond with a JSON object that strictly follows this Zod schema:
\`\`\`json
{{{json outputSchema}}}
\`\`\`
`,
});

const lowStockAlertsFlow = ai.defineFlow(
  {
    name: 'lowStockAlertsFlow',
    inputSchema: LowStockAlertInputSchema,
    outputSchema: LowStockAlertOutputSchema,
  },
  async input => {
    const {output} = await lowStockAlertsPrompt(input);
    return output!;
  }
);
