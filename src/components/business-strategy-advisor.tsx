
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useData } from '@/context/data-context';
import { suggestBusinessStrategy } from '@/ai/flows/business-strategy-suggester';
import { useTasks } from '@/context/task-context';
import { Wand2, Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function BusinessStrategyAdvisor() {
  const { products, transactions, orders, suppliers, categories } = useData();
  const { tasks, runTask } = useTasks();
  const [strategy, setStrategy] = useState<string>('');

  const taskId = 'business-strategy';
  const task = tasks[taskId];

  const handleGenerateStrategy = async () => {
    if (!products.length || !transactions.length) {
      setStrategy('Not enough data to generate a reliable insight yet.');
      return;
    }
    
    await runTask(
      taskId,
      async () => {
        const result = await suggestBusinessStrategy({
          products,
          transactions,
          orders,
          suppliers,
          categories,
        });
        setStrategy(result);
        return result;
      },
      'Analyzing your business data to generate growth strategies...'
    );
  };
  
  const renderFormattedText = (text: string) => {
    const sections = text.split(/(\p{Emoji}\s\*\*.*?\*\*)/u).filter(Boolean);
    return sections.map((section, index) => {
      const match = section.match(/(\p{Emoji}\s\*\*.*?\*\*)/u);
      if (match) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{section.replace(/\*/g, '')}</h3>;
      }
      return <p key={index} className="text-muted-foreground whitespace-pre-wrap">{section.trim()}</p>;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>AI Business Strategy Advisor</CardTitle>
          <CardDescription>
            Get AI-powered insights and strategies based on your data.
          </CardDescription>
        </div>
        <Button onClick={handleGenerateStrategy} disabled={task?.status === 'running'}>
           {task?.status === 'running' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Growth Strategies
        </Button>
      </CardHeader>
      <CardContent>
        {task?.status === 'running' && (
           <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-6 w-1/3 mt-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
                 <Skeleton className="h-6 w-1/4 mt-4" />
                <Skeleton className="h-4 w-full" />
            </div>
        )}
        {task?.status === 'success' && strategy && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {renderFormattedText(strategy)}
          </div>
        )}
         {task?.status === 'error' && (
          <div className="text-destructive">
            <p>An error occurred: {task.error}</p>
          </div>
        )}
        {!task && (
            <div className="text-center py-8 text-muted-foreground">
                <Wand2 className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-4">Click the button to generate your personalized business strategy.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
