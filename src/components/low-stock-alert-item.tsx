
"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { getLowStockAlerts } from "@/ai/flows/low-stock-alerts";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2, Lightbulb } from "lucide-react";
import type { LowStockAlertsOutput } from "@/ai/flows/low-stock-alerts";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/context/task-context";

type LowStockAlertItemProps = {
  product: Product;
};

export function LowStockAlertItem({ product }: LowStockAlertItemProps) {
  const { runTask, tasks } = useTasks();
  const taskId = `low-stock-${product.id}`;
  const task = tasks[taskId];

  const handleGetSuggestion = async () => {
    runTask(
        taskId,
        () => getLowStockAlerts({
            productId: product.id,
            currentStock: product.stock,
            averageDailySales: product.averageDailySales,
            leadTimeDays: product.leadTimeDays,
        }),
        'Generating reorder suggestion...'
    );
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
          disabled={task?.status === 'running'}
          size="sm"
          variant="outline"
          className="ml-4"
        >
          {task?.status === 'running' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Suggest Reorder
        </Button>
      </div>
      {task?.status === 'success' && task.result && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>AI Recommendation</AlertTitle>
          <AlertDescription>{(task.result as LowStockAlertsOutput).alertMessage}</AlertDescription>
        </Alert>
      )}
       {task?.status === 'error' && (
        <Alert variant="destructive">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{task.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
