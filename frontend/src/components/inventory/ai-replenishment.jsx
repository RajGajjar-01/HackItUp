import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react"

const aiSuggestions = [
  {
    item: "Cooking Oil",
    suggestion: "Order 20L - Usage increased by 25% this week",
    confidence: 92,
  },
  {
    item: "Chicken",
    suggestion: "Order 15kg - Based on weekend forecast",
    confidence: 87,
  },
  {
    item: "Flour",
    suggestion: "Order 25kg - Low stock detected",
    confidence: 95,
  },
]

export default function AiReplenishment() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Replenishment
        </CardTitle>
        <CardDescription>Smart inventory suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiSuggestions.map((suggestion, index) => (
            <div key={index} className="bg-muted/50 p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{suggestion.item}</div>
                  <div className="text-sm text-muted-foreground mt-1">{suggestion.suggestion}</div>
                </div>
                <div className="flex items-center bg-primary/10 px-2 py-1 rounded text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {suggestion.confidence}% confidence
                </div>
              </div>
              <div className="flex justify-end mt-2 space-x-2">
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Ignore
                </Button>
                <Button size="sm" className="h-8 px-2">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-primary" />
              AI predictions based on historical data and current usage patterns
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

