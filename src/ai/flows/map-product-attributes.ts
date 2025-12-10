'use server';
/**
 * @fileOverview An AI agent for mapping user-provided dataset attributes
 * to the application's canonical Product schema.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { ProductSchema } from '@/lib/types.zod';

// 1. Define Input/Output Schemas for the AI agent

const MappingInputSchema = z.object({
  sourceAttributes: z.array(z.string()).describe("The column headers from the user's uploaded dataset."),
  targetSchema: z.string().describe("A string representation of the canonical JSON schema for a Product."),
});
export type MappingInput = z.infer<typeof MappingInputSchema>;

const MappingResultSchema = z.object({
  source_attribute: z.string().describe("The original column name from the user's file."),
  mapped_attribute: z.string().nullable().describe("The best-matching attribute from the canonical schema, or null if no good match is found."),
  confidence: z.number().min(0).max(1).describe("The AI's confidence in the mapping, from 0.0 (no confidence) to 1.0 (certain)."),
  transformation_needed: z.enum(["rename", "type_cast", "unit_conversion", "value_map", "none"]).describe("The type of transformation required to match the canonical format."),
  notes: z.string().describe("A brief explanation for the mapping decision or required transformation."),
});
export type MappingResult = z.infer<typeof MappingResultSchema>;

const MappingOutputSchema = z.object({
  mappings: z.array(MappingResultSchema),
});
export type MappingOutput = z.infer<typeof MappingOutputSchema>;


// 2. Create an exported wrapper function to call the flow

/**
 * Invokes the attribute mapping AI agent.
 * @param input The source attributes from the user's dataset and the target schema.
 * @returns A promise that resolves to the suggested attribute mappings.
 */
export async function mapProductAttributes(input: MappingInput): Promise<MappingOutput> {
  return attributeMappingFlow(input);
}


// 3. Define the Genkit Prompt for the mapping agent

const mappingAgentPrompt = ai.definePrompt({
  name: 'attributeMappingAgentPrompt',
  input: { schema: MappingInputSchema },
  output: { schema: MappingOutputSchema },
  prompt: `You are an expert attribute-mapping agent. Your task is to take a list of source attributes from a user's dataset and map them to the closest matching attributes in the application's canonical dataset schema.

RULES:
- Analyze the user's attribute names for similarity, meaning, and patterns.
- If you are uncertain about a mapping, provide the best possible match but lower the confidence score.
- If no reasonable mapping exists, set "mapped_attribute" to null.
- For each mapping, determine if a data transformation is needed (e.g., 'type_cast' for "1,299.99" -> 1299.99, 'rename' for "Product Name" -> "name").
- Provide a concise note explaining your reasoning for each mapping.

User's Dataset Attributes:
{{#each sourceAttributes}}
- {{{this}}}
{{/each}}

Application's Canonical Product Schema:
\`\`\`json
{{{targetSchema}}}
\`\`\`

Return a JSON array of mapping results.`,
});


// 4. Define the Genkit Flow that orchestrates the agent

const attributeMappingFlow = ai.defineFlow(
  {
    name: 'attributeMappingFlow',
    inputSchema: MappingInputSchema,
    outputSchema: MappingOutputSchema,
  },
  async (input) => {
    // For this task, we want the AI to be highly structured and deterministic.
    // A lower temperature reduces randomness.
    const { output } = await mappingAgentPrompt(input, {
        config: { temperature: 0.1 }
    });
    
    if (!output) {
      throw new Error('Attribute mapping agent failed to return a result.');
    }
    
    return output;
  }
);
