'use server';
/**
 * @fileOverview A flow for generating product descriptions.
 *
 * - generateDescription - A function that generates a product description.
 * - GenerateDescriptionInput - The input type for the generateDescription function.
 * - GenerateDescriptionOutput - The return type for the generateDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product.'),
});
export type GenerateDescriptionInput = z.infer<
  typeof GenerateDescriptionInputSchema
>;

const GenerateDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A compelling and informative product description.'),
});
export type GenerateDescriptionOutput = z.infer<
  typeof GenerateDescriptionOutputSchema
>;

export async function generateDescription(
  input: GenerateDescriptionInput
): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const generateDescriptionPrompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: {schema: GenerateDescriptionInputSchema},
  output: {schema: GenerateDescriptionOutputSchema},
  prompt: `You are a marketing expert specializing in writing compelling product descriptions for e-commerce stores.

Generate a captivating and informative description for the following product:

Product Name: {{{productName}}}
Category: {{{category}}}

The description should be 1-2 sentences long, highlight key features, and use engaging language. Respond with the description in the schema provided.`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateDescriptionPrompt(input);
    return output!;
  }
);
