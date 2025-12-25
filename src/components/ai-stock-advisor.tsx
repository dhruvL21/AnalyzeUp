
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
import type { AIStockAdvisorOutput } from '@/ai/flows/low-stock-alerts';
import { aiStockAdvisor } from '@/ai/flows/low-stock-alerts';
import { generateSalesStrategy } from '@/ai/flows/business-strategy-generator';
import type { SalesStrategyOutput } from '@/ai/flows/business-strategy-generator';

export function AIStockAdvisor() {
  const { products, transactions } = useData();
  const [isPending, startTransition] = useTransition();
  const [isStrategyPending, startStrategyTransition] = useTransition();

  const [recommendations, setRecommendations] = useState<AIStockAdvisorOutput[]>([]);
  const [strategy, setStrategy] = useState<SalesStrategyOutput | null>(null);

  const handleGetSuggestions = () => {
    startTransition(async () => {
        const lowStockProducts = products.filter(p => p.stock < 20);
        if (lowStockProducts.length === 0) return;
        
        const promises = lowStockProducts.map(p => aiStockAdvisor({
            productName: p.name,
            currentStockLevel: p.stock,
            averageDailySales: p.averageDailySales,
            supplierLeadTimeDays: p.leadTimeDays,
        }));

        const results = await Promise.all(promises);
        setRecommendations(results.filter(r => r.stockoutRisk));
    });
  };

  const handleGenerateStrategy = () => {
    startStrategyTransition(async () => {
        const salesData = JSON.stringify(transactions.filter(t => t.type === 'Sale'));
        const productData = JSON.stringify(products);
        
        const result = await generateSalesStrategy({ salesData, productData });
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
                stock based on sales velocity and lead times.
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
                        <p className="font-semibold">{products.find(p => recommendations.some(r => r.reasoning.includes(p.name)))?.name}</p>
                        <p className="text-sm text-muted-foreground">
                           {item.reasoning}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="font-bold text-destructive">
                            Reorder {item.recommendedReorderQuantity} units
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
                    low stock items.
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
                    Receive an AI-powered growth strategy based on your sales and product data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {strategy ? (
                    <div className="space-y-4">
                        <h4 className="font-semibold">{strategy.strategySummary}</h4>
                        <div>
                            <p className='font-medium text-sm'>Key Recommendations:</p>
                            <p className="text-sm text-muted-foreground">{strategy.keyRecommendations}</p>
                        </div>
                         <div>
                            <p className='font-medium text-sm'>Expected Outcomes:</p>
                            <p className="text-sm text-muted-foreground">{strategy.expectedOutcomes}</p>
                        </div>
                         <div>
                            <p className='font-medium text-sm'>Risk Factors:</p>
                            <p className="text-sm text-muted-foreground">{strategy.potentialRisks}</p>
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
