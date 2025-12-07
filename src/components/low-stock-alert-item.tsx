
"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { getLowStockAlerts } from "@/ai/flows/low-stock-alerts";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2, Lightbulb } from "lucide-react";
import type { LowStockAlertsOutput } from "@/ai/flows/low-stock-alerts";
import { useToast } from "@/hooks/use-toast";

type LowStockAlertItemProps = {
  product: Product;
};

export function LowStockAlertItem({ product }: LowStockAlertItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<LowStockAlertsOutput | null>(
    null
  );
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);

    try {
      const result = await getLowStockAlerts({
        productId: product.id,
        currentStock: product.stock,
        averageDailySales: product.averageDailySales,
        leadTimeDays: product.leadTimeDays,
      });
      setSuggestion(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium truncate">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            Current stock: <span className="font-bold">{product.stock}</span>
          </p>
        </div>
        <Button
          onClick={handleGetSuggestion}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="ml-4"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Suggest Reorder
        </Button>
      </div>
      {suggestion && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>AI Recommendation</AlertTitle>
          <AlertDescription>{suggestion.alertMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
