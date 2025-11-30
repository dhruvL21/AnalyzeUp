"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { Button } from "./ui/button";
import { getReorderSuggestionAction } from "@/lib/actions";
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

    const result = await getReorderSuggestionAction({
      productId: product.id,
      currentStock: product.stock,
      averageDailySales: product.averageDailySales,
      leadTimeDays: product.leadTimeDays,
    });

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.data) {
      setSuggestion(result.data);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            Current stock: <span className="font-bold">{product.stock}</span>
          </p>
        </div>
        <Button
          onClick={handleGetSuggestion}
          disabled={isLoading}
          size="sm"
          variant="outline"
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
