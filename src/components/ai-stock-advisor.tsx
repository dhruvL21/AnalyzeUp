
'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bot, Lightbulb, Loader2 } from 'lucide-react';
import { useData } from '@/context/data-context';
import type { lowStockProduct } from '@/ai/flows/low-stock-alerts';
import { getLowStockSuggestions } from '@/ai/flows/low-stock-alerts';
import { generateBusinessStrategy } from '@/ai/flows/business-strategy-generator';
import type { BusinessStrategy } from '@/ai/flows/business-strategy-generator';

export function AIStockAdvisor() {
  const { products, transactions } = useData();
  const [isPending, startTransition] = useTransition();
  const [isStrategyPending, startStrategyTransition] = useTransition();

  const [recommendations, setRecommendations] = useState<lowStockProduct[]>([]);
  const [strategy, setStrategy] = useState<BusinessStrategy | null>(null);

  const handleGetSuggestions = () => {
    startTransition(async () => {
      const allProducts = products.map(p => ({
          name: p.name,
          stock: p.stock,
          averageDailySales: p.averageDailySales,
          leadTimeDays: p.leadTimeDays,
      }));
      const result = await getLowStockSuggestions({ products: allProducts });
      setRecommendations(result.lowStockProducts);
    });
  };

  const handleGenerateStrategy = () => {
    startStrategyTransition(async () => {
        const salesData = transactions.filter(t => t.type === 'Sale').map(t => ({
            productId: t.productId,
            quantity: t.quantity,
            transactionDate: t.transactionDate,
        }));
        const result = await generateBusinessStrategy({ sales: salesData, products });
        setStrategy(result);
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Bot />
                AI Stock Advisor
                </CardTitle>
                <CardDescription>
                Get intelligent recommendations for products that are running low on
                stock based on sales velocity and market trends.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {recommendations.length > 0 ? (
                <div className="space-y-4">
                    {recommendations.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                        <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                            Predicted Demand: {item.predictedDemand} units/week
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="font-bold text-destructive">
                            Reorder {item.reorderSuggestion} units
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Current Stock: {item.currentStock}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-lg h-full">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                    No recommendations available yet. Click the button to analyze your
                    inventory.
                    </p>
                </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleGetSuggestions} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Analyzing...' : 'Get Suggestions'}
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Lightbulb />
                    AI Strategy Generator
                </CardTitle>
                <CardDescription>
                    Receive AI-powered recommendations to grow your business based on your sales and product data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {strategy ? (
                    <div className="space-y-4">
                        <h4 className="font-semibold">{strategy.title}</h4>
                        <div className='space-y-2'>
                            <p className='font-medium text-sm'>Key Recommendations:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {strategy.keyRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                         <div className='space-y-2'>
                            <p className='font-medium text-sm'>Expected Outcomes:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {strategy.expectedOutcomes.map((out, i) => <li key={i}>{out}</li>)}
                            </ul>
                        </div>
                         <div className='space-y-2'>
                            <p className='font-medium text-sm'>Risk Factors:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {strategy.riskFactors.map((risk, i) => <li key={i}>{risk}</li>)}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-lg h-full">
                        <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                        Generate a business strategy based on your current performance data.
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerateStrategy} disabled={isStrategyPending}>
                    {isStrategyPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isStrategyPending ? 'Generating...' : 'Generate Strategy'}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
