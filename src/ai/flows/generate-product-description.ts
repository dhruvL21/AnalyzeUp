'use server';
/**
 * @fileOverview A Genkit flow for generating product descriptions.
 * This file defines a flow that takes a product name and generates a creative
 * and appealing description for e-commerce purposes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for the input, which is just the product name.
const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product for which to generate a description.'),
});
type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

// Define the schema for the output, which is the generated description.
const GenerateProductDescriptionOutputSchema = z.object({
    description: z.string().describe('The generated product description.'),
});
type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;


/**
 * An exported wrapper function that calls the Genkit flow.
 * This makes it easy to invoke the flow from other parts of the application.
 * @param input The product name.
 * @returns A promise that resolves to the generated description.
 */
export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}


// Define the prompt that will be sent to the AI model.
const generateDescriptionPrompt = ai.definePrompt(
  {
    name: 'generateProductDescriptionPrompt',
    input: { schema: GenerateProductDescriptionInputSchema },
    output: { schema: GenerateProductDescriptionOutputSchema },
    prompt: `You are an expert e-commerce copywriter.
      Generate a compelling, short (2-3 sentences) product description for the following product: {{{productName}}}.
      
      Focus on the key benefits and unique selling points. Use an engaging and persuasive tone.
      Do not use markdown or special formatting. Just return the description text.`,
  },
);

// Define the Genkit flow that orchestrates the AI call.
const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: generateDescriptionPrompt,
      model: 'gemini-1.5-flash',
      input,
    });
    
    if (!output) {
      throw new Error('Failed to generate description.');
    }
    return output;
  }
);
