
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, RefreshCw } from 'lucide-react';
import { useData } from '@/context/data-context';
import { suggestBusinessStrategy } from '@/ai/flows/business-strategy-suggester';
import { Skeleton } from '@/components/ui/skeleton';

export function BusinessStrategyAdvisor() {
  const { products, transactions, suppliers } = useData();
  const [strategy, setStrategy] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateStrategy = async () => {
    setIsLoading(true);
    setStrategy(null);
    try {
        const result = await suggestBusinessStrategy({ products, transactions, suppliers });
        setStrategy(result);
    } catch (error) {
        console.error('Failed to generate business strategy:', error);
        setStrategy('Sorry, I was unable to generate a strategy at this time. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Automatically generate strategy on component mount
    generateStrategy();
  }, []); // Run only once when the component mounts

  const formatStrategy = (text: string) => {
    // Split by lines and process each line
    return text.split('\n').map((line, index) => {
      if (line.startsWith('- **')) { // Main bullets
        return <p key={index} className="font-semibold text-primary mt-2">{line.replace('- **', '').replace('**', '')}</p>;
      }
      if (line.startsWith('  - ')) { // Sub-bullets
        return <p key={index} className="ml-4 text-sm text-muted-foreground">{line.replace('  - ', '• ')}</p>;
      }
       if (line.match(/📌|📈|🚀|💰|📦|🔍/)) { // Section headers
        return <h4 key={index} className="text-md font-semibold mt-4 mb-1">{line}</h4>;
      }
      return <p key={index} className="text-sm">{line}</p>;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Business Strategy Advisor</span>
          </CardTitle>
          <CardDescription>
            Get AI-powered insights and strategies to grow your business.
          </CardDescription>
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={generateStrategy}
            disabled={isLoading}
            >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden sm:inline">
                {isLoading ? 'Generating...' : 'Regenerate'}
            </span>
            </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className='space-y-4'>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-6 w-1/4 mt-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        )}
        {strategy && (
          <div className="prose prose-sm max-w-none text-foreground">
            {formatStrategy(strategy)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
