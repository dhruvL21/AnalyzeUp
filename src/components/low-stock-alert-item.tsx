
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { useData } from '@/context/data-context';
import type { Product } from '@/lib/types';
import { useTasks } from '@/context/task-context';
import { getRestockSuggestion } from '@/ai/flows/low-stock-alerts';

interface LowStockAlertItemProps {
  product: Product;
}

export function LowStockAlertItem({ product }: LowStockAlertItemProps) {
  const { transactions } = useData();
  const { tasks, runTask } = useTasks();
  const [suggestion, setSuggestion] = useState<any>(null);

  const taskId = `restock-${product.id}`;
  const task = tasks[taskId];

  const handleGetSuggestion = async () => {
    const productTransactions = transactions.filter(t => t.productId === product.id);

    await runTask(
      taskId,
      async () => {
        const result = await getRestockSuggestion({
          product,
          transactions: productTransactions,
        });
        setSuggestion(result.products[0]);
        return result;
      },
      `Generating restock suggestion for ${product.name}...`
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <Image
          alt={product.name}
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.imageUrl || 'https://placehold.co/64x64'}
          width="64"
          unoptimized
        />
        <div className="flex-1">
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>Current Stock: {product.stock}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {task?.status === 'running' && (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">AI is analyzing sales data...</p>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Suggested Reorder:</span>
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                 <div className="flex items-center justify-between">
                    <span className="font-semibold">Days of Cover:</span>
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <p className="text-xs text-muted-foreground pt-2">Generating reason...</p>
            </div>
        )}
        {suggestion && task?.status === 'success' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Suggested Reorder:</span>
              <span className="font-bold text-primary">{suggestion.suggestedReorderQty} units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Est. Days of Cover:</span>
              <span className="font-bold">{suggestion.expectedDaysOfCover} days</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              <span className="font-semibold">AI Reason:</span> {suggestion.reason}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleGetSuggestion} 
          disabled={task?.status === 'running'}
        >
          {task?.status === 'running' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Suggest Reorder
        </Button>
      </CardFooter>
    </Card>
  );
}
