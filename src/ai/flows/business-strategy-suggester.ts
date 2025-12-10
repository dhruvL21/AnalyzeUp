
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const BusinessStrategyInputSchema = z.object({
  products: z.array(z.any()),
  transactions: z.array(z.any()),
  suppliers: z.array(z.any()),
});
type BusinessStrategyInput = z.infer<typeof BusinessStrategyInputSchema>;

export async function suggestBusinessStrategy(
  input: BusinessStrategyInput
): Promise<string> {
  return suggestStrategiesFlow(input);
}

const MODEL_CANDIDATES = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
  'gemini-pro',
];

const suggestStrategiesFlow = ai.defineFlow(
  {
    name: 'suggestStrategiesFlow',
    inputSchema: BusinessStrategyInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const errors: Array<{ model: string; message: string }> = [];

    for (const modelName of MODEL_CANDIDATES) {
      try {
        console.log(`Attempting to generate strategy with model: ${modelName}`);
        const suggestStrategiesPrompt = ai.definePrompt({
            name: `suggestStrategiesPrompt-${modelName.replace(/[^a-zA-Z0-9]/g, '_')}`,
            output: { format: 'text' },
            input: { schema: BusinessStrategyInputSchema },
            model: modelName,
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

              - 📌 **Executive Summary:** A short, clear overview of the current business state and key recommendations.
              - 📈 **Sales & Marketing Strategy (Short-Term):** Immediate actions to boost sales.
              - 🚀 **Sales & Growth Strategy (Long-Term):** Sustainable growth plans.
              - 💰 **Pricing & Profit Suggestions:** Ideas for price adjustments, bundles, or promotions to improve margins.
              - 📦 **Inventory Insights & Forecast:** Guidance on stock management, including items to reorder, discontinue, or promote, and a future forecast if trends are clear.
              - 🔍 **Category-wise or Supplier-wise Notes:** Specific observations about product categories or supplier performance.

              Base all your insights directly on the data provided. If there is not enough data to provide a meaningful insight for a section, state that and explain what data you would need.
            `,
          });
        
        const { output } = await suggestStrategiesPrompt(input);
        
        if (output) {
          console.log(`Successfully generated strategy with model: ${modelName}`);
          return output;
        }
        
        errors.push({ model: modelName, message: "Empty response from model." });

      } catch (err: any) {
        const msg = err?.message ?? String(err);
        errors.push({ model: modelName, message: msg });
        console.warn(`Model ${modelName} failed. Trying next... Error: ${msg}`);
      }
    }

    const aggregatedErrors = errors.map(e => `${e.model}: ${e.message}`).join("\n");
    throw new Error(`No available Gemini models succeeded. Attempts:\n${aggregatedErrors}`);
  }
);
