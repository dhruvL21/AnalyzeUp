
'use server';
/**
 * @fileOverview This file defines the AI flow for generating business strategy suggestions.
 *
 * - suggestBusinessStrategy - a server action that analyzes store data and returns strategic advice.
 */
import {z} from 'zod';
import {ai} from '@/ai/genkit';
import {
  ProductSchema,
  TransactionSchema,
  PurchaseOrderSchema,
  SupplierSchema,
  CategorySchema,
} from '@/lib/types.zod';
import { googleAI } from '@genkit-ai/google-genai';

const BusinessStrategyInputSchema = z.object({
  products: z.array(ProductSchema),
  transactions: z.array(TransactionSchema),
  orders: z.array(PurchaseOrderSchema),
  suppliers: z.array(SupplierSchema),
  categories: z.array(CategorySchema),
});

type BusinessStrategyInput = z.infer<typeof BusinessStrategyInputSchema>;

export async function suggestBusinessStrategy(
  input: BusinessStrategyInput
): Promise<string> {
  // If there's not enough data, return the specific message.
  if (input.products.length < 2 || input.transactions.length < 2) {
    return 'Not enough data to generate a reliable insight yet.';
  }
  return suggestStrategiesFlow(input);
}

const suggestStrategiesPrompt = ai.definePrompt({
  name: 'suggestStrategiesPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: BusinessStrategyInputSchema},
  prompt: `
You are an expert business analyst and e-commerce strategist. Your task is to analyze the provided store data and generate a practical, actionable business strategy.

**Analyze the following data:**
- Sales history and revenue trends.
- Product performance (pricing, stock levels, sales velocity).
- Supplier lead times and order history.
- Category performance.

**Based on your analysis, provide a structured business strategy. Use the following format exactly and provide specific, data-driven advice, not generic suggestions.**

- **Product Data:**
  \`\`\`json
  {{{json products}}}
  \`\`\`
- **Transaction Data:**
  \`\`\`json
  {{{json transactions}}}
  \`\`\`
- **Purchase Order Data:**
  \`\`\`json
  {{{json orders}}}
  \`\`\`
- **Supplier Data:**
  \`\`\`json
  {{{json suppliers}}}
  \`\`\`
- **Category Data:**
  \`\`\`json
  {{{json categories}}}
  \`\`\`

---

**Required Output Structure:**

📌 **Executive Summary**
*(A short, clear summary of the current business state and key recommendations.)*

📈 **Sales & Marketing Strategy (Short-Term)**
*(Actionable steps for the next 1-3 months. e.g., "Promote 'Product X' which has high stock and good margins.")*

🚀 **Sales & Growth Strategy (Long-Term)**
*(Strategic goals for the next 6-12 months. e.g., "Expand the 'Tops' category based on its strong, consistent sales growth.")*

💰 **Pricing & Profit Suggestions**
*(Specific ideas for pricing. e.g., "Consider bundling 'Product A' and 'Product B' for a 10% discount to increase average order value.")*

📦 **Inventory Insights & Forecast**
*(Guidance on stock management. e.g., "'Product Y' is a slow-mover with high stock; consider a clearance sale. Forecast suggests demand for 'Product Z' will increase by 20% in the next quarter; prepare to reorder.")*

🔍 **Category-wise or Supplier-wise Notes**
*(Observations about specific categories or suppliers. e.g., "'Supplier A' has the fastest lead times, prioritize them for key products.")*
`,
});

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
