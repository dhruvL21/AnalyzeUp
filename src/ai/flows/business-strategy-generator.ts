
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { ProductSchema, TransactionSchema, BusinessStrategyInputSchema, BusinessStrategySchema } from '@/lib/types.zod';

export type BusinessStrategy = z.infer<typeof BusinessStrategySchema>;

const strategyPrompt = ai.definePrompt({
  name: 'businessStrategyPrompt',
  input: { schema: BusinessStrategyInputSchema },
  output: { schema: BusinessStrategySchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are a world-class business strategist for e-commerce brands. Analyze the provided sales and product data to generate a concise, actionable growth strategy.

Data:
- Products: {{{json products}}}
- Sales Transactions: {{{json sales}}}

Based on this data, provide a strategy that includes:
1.  A clear title.
2.  3-5 key recommendations (e.g., pricing adjustments, marketing campaigns for specific products, bundling opportunities).
3.  Potential risk factors.
4.  Expected positive outcomes.

Focus on high-impact, easy-to-implement suggestions.`,
});

const businessStrategyFlow = ai.defineFlow(
  {
    name: 'businessStrategyFlow',
    inputSchema: BusinessStrategyInputSchema,
    outputSchema: BusinessStrategySchema,
  },
  async (input) => {
    const { output } = await strategyPrompt(input);
    if (!output) {
      throw new Error('Failed to generate business strategy.');
    }
    return output;
  }
);

export async function generateBusinessStrategy(
  input: z.infer<typeof BusinessStrategyInputSchema>
): Promise<BusinessStrategy> {
  return await businessStrategyFlow(input);
}
