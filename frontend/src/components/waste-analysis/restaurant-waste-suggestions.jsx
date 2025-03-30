"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, UtensilsCrossed, Scale, ShoppingCart, Clock } from "lucide-react"

export function RestaurantWasteSuggestions() {
  const suggestions = [
    {
      id: 1,
      title: "Optimize Portion Sizes",
      description:
        "Analyze customer plate waste and adjust portion sizes for items with high waste rates. This can reduce food waste by up to 25% without affecting customer satisfaction.",
      impact: "High",
      savings: "₹8,550 annually",
      implementation: "Easy",
      category: "Portion Control",
      progress: 15,
      icon: <Scale className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Improve Inventory Management",
      description:
        "Implement a first-in, first-out (FIFO) inventory system and optimize order quantities based on PetPooja sales data to reduce spoilage.",
      impact: "Medium",
      savings: "₹6,200 annually",
      implementation: "Medium",
      category: "Inventory",
      progress: 60,
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Repurpose Excess Ingredients",
      description:
        "Create daily specials using ingredients that are approaching their use-by date. This can reduce waste while creating new menu opportunities.",
      impact: "Medium",
      savings: "₹5,400 annually",
      implementation: "Easy",
      category: "Menu Planning",
      progress: 30,
      icon: <UtensilsCrossed className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Staff Training Program",
      description:
        "Implement a comprehensive staff training program on food waste reduction techniques, proper storage, and preparation methods.",
      impact: "High",
      savings: "₹7,250 annually",
      implementation: "Medium",
      category: "Training",
      progress: 0,
      icon: <Clock className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">AI-Driven Waste Reduction Suggestions</h2>
      </div>

      <p className="text-muted-foreground">
        Based on your restaurant's waste patterns and PetPooja data, our AI system has identified the following
        opportunities to reduce food waste and increase profitability.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center">
                    <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {suggestion.icon}
                    </span>
                    {suggestion.title}
                  </CardTitle>
                  <CardDescription>{suggestion.description}</CardDescription>
                </div>
                <Badge
                  variant={
                    suggestion.impact === "High"
                      ? "destructive"
                      : suggestion.impact === "Medium"
                        ? "default"
                        : "outline"
                  }
                >
                  {suggestion.impact} Impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Potential Savings</p>
                    <p className="text-lg font-bold">{suggestion.savings}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Implementation</p>
                    <p className="text-lg font-bold">{suggestion.implementation}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Implementation Progress</p>
                    <p className="text-sm font-medium">{suggestion.progress}%</p>
                  </div>
                  <Progress value={suggestion.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Implement Suggestion</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Item Recommendations</CardTitle>
          <CardDescription>Specific recommendations for high-waste menu items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Paneer Butter Masala</h3>
                <Badge>18.5% Waste</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Recommendation: Reduce batch size by 20% and prepare more frequently throughout service. Consider
                offering as a half-portion option.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Veg Biryani</h3>
                <Badge>15.2% Waste</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Recommendation: Prepare base separately from rice and combine to order. Repurpose leftover rice for
                staff meals or fried rice specials.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Garlic Naan</h3>
                <Badge>10.3% Waste</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Recommendation: Prepare dough in advance but cook naan to order. Consider reducing complimentary naan
                with certain dishes.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-medium">PetPooja Integration Benefits:</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Use PetPooja sales data to predict demand more accurately</li>
              <li>Track waste reduction progress directly in your PetPooja dashboard</li>
              <li>Automatically adjust inventory orders based on waste reduction goals</li>
              <li>Generate sustainability reports for marketing and customer engagement</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

