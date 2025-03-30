"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, TrendingUp, Recycle, DollarSign, BarChart3 } from "lucide-react"

export function WasteReductionSuggestions() {
  const suggestions = [
    {
      id: 1,
      title: "Implement Organic Waste Composting",
      description:
        "Converting organic waste into compost can reduce disposal costs by up to 30% and provide nutrient-rich soil for landscaping.",
      impact: "High",
      savings: "$4,200 annually",
      implementation: "Medium",
      category: "Organic",
      progress: 15,
      icon: <Recycle className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Optimize Packaging Materials",
      description:
        "Switching to lightweight, recyclable packaging can reduce waste volume by 25% and lower transportation costs.",
      impact: "Medium",
      savings: "$3,100 annually",
      implementation: "Easy",
      category: "Packaging",
      progress: 60,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Install Smart Waste Monitoring System",
      description: "IoT sensors can optimize collection schedules and reduce transportation costs by 20%.",
      impact: "High",
      savings: "$5,800 annually",
      implementation: "Complex",
      category: "Technology",
      progress: 0,
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Implement Material Recovery Program",
      description:
        "Recovering valuable materials from waste streams can generate additional revenue and reduce disposal costs.",
      impact: "Medium",
      savings: "$2,900 annually",
      implementation: "Medium",
      category: "Recycling",
      progress: 35,
      icon: <DollarSign className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">AI-Driven Waste Reduction Suggestions</h2>
      </div>

      <p className="text-muted-foreground">
        Based on your waste generation patterns and financial data, our AI system has identified the following
        opportunities for waste reduction and cost savings.
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
          <CardTitle>AI Analysis Summary</CardTitle>
          <CardDescription>Overall waste reduction potential based on current operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Waste Reduction</h3>
                <p className="text-3xl font-bold mt-2">28%</p>
                <p className="text-sm text-muted-foreground mt-1">Potential reduction in total waste</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Cost Savings</h3>
                <p className="text-3xl font-bold mt-2">$16,000</p>
                <p className="text-sm text-muted-foreground mt-1">Estimated annual savings</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Carbon Reduction</h3>
                <p className="text-3xl font-bold mt-2">42 tons</p>
                <p className="text-sm text-muted-foreground mt-1">Annual CO₂ equivalent reduction</p>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="font-medium">AI Recommendation:</p>
              <p className="mt-1">
                Based on your current waste profile, focusing on organic waste composting and smart monitoring systems
                will yield the highest ROI. We recommend implementing these two initiatives first for maximum impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

