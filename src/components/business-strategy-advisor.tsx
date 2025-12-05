"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { suggestStrategies, type SuggestStrategiesInput, type SuggestStrategiesOutput } from "@/ai/flows/business-strategy-suggester";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2, Lightbulb, TrendingUp, Package, PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";

type BusinessStrategyAdvisorProps = SuggestStrategiesInput;

export function BusinessStrategyAdvisor(props: BusinessStrategyAdvisorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestStrategiesOutput | null>(
    null
  );
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);

    try {
      const result = await suggestStrategies(props);
      setSuggestion(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI strategies. Please try again.",
      });
    }

    setIsLoading(false);
  };

  const getPriorityVariant = (priority: 'High' | 'Medium' | 'Low') => {
    switch(priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'default';
    }
  }

  const getPriorityIcon = (priority: 'High' | 'Medium' | 'Low') => {
    switch(priority) {
      case 'High': return <TrendingUp className="h-4 w-4" />;
      case 'Medium': return <Package className="h-4 w-4" />;
      case 'Low': return <PiggyBank className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  }


  return (
    <div className="space-y-4">
      <Button
        onClick={handleGetSuggestion}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="mr-2 h-4 w-4" />
        )}
        Generate Growth Strategies
      </Button>

      {suggestion && (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI-Generated Business Strategies</h3>
            {suggestion.strategies.map((strat, index) => (
                <Alert key={index} className="border-l-4" style={{borderColor: `hsl(var(--chart-${(index % 5) + 1}))`}}>
                  <div className="flex items-start justify-between">
                    <AlertTitle className="flex items-center gap-2 text-base">
                      {getPriorityIcon(strat.priority)}
                      {strat.title}
                    </AlertTitle>
                     <Badge variant={getPriorityVariant(strat.priority)}>{strat.priority}</Badge>
                  </div>
                  <AlertDescription className="mt-2">
                    {strat.description}
                  </AlertDescription>
                </Alert>
            ))}
        </div>
      )}
    </div>
  );
}
