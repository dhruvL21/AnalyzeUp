'use server';

import { getLowStockAlerts, type LowStockAlertsInput } from "@/ai/flows/low-stock-alerts";
import { generateDescription, type GenerateDescriptionInput } from "@/ai/flows/generate-product-description";
import { z } from "zod";

const LowStockAlertsInputSchema = z.object({
  productId: z.string(),
  currentStock: z.number(),
  averageDailySales: z.number(),
  leadTimeDays: z.number(),
});


export async function getReorderSuggestionAction(input: LowStockAlertsInput) {
  const parsedInput = LowStockAlertsInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await getLowStockAlerts(parsedInput.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get suggestion. Please try again.' };
  }
}

const GenerateDescriptionInputSchema = z.object({
  productName: z.string(),
  category: z.string(),
});

export async function generateDescriptionAction(input: GenerateDescriptionInput) {
  const parsedInput = GenerateDescriptionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await generateDescription(parsedInput.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get AI description. Please try again.' };
  }
}
