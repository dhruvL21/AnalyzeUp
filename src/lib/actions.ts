'use server';

import { getLowStockAlerts, type LowStockAlertsInput } from "@/ai/flows/low-stock-alerts";
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
