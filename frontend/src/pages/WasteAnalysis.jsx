"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RestaurantWasteMetrics } from "@/components/waste-analysis/restaurant-waste-metrics"
import { RestaurantFinancialImpact } from "@/components/waste-analysis/restaurant-financial-impact"
import { RestaurantWasteSuggestions } from "@/components/waste-analysis/restaurant-waste-suggestions"
import { RestaurantWasteHeatMap } from "@/components/waste-analysis/restaurant-waste-heat-map"
import { Badge } from "@/components/ui/badge"
import { UtensilsCrossed, TrendingDown, DollarSign, BarChart3 } from "lucide-react"

export default function WasteAnalysis() {
  const [timeframe, setTimeframe] = useState  ("daily")

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Restaurant Waste Analysis</h1>
              <Badge variant="outline" className="text-sm font-medium">
                PetPooja Integration
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Monitor food waste, reduce costs, and improve sustainability for your restaurant
            </p>
          </div>
          <div className="flex items-center">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              <button
                onClick={() => setTimeframe("daily")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  timeframe === "daily" ? "bg-background text-foreground shadow-sm" : ""
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeframe("weekly")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  timeframe === "weekly" ? "bg-background text-foreground shadow-sm" : ""
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeframe("monthly")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  timeframe === "monthly" ? "bg-background text-foreground shadow-sm" : ""
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Food Waste</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48.5 kg</div>
              <p className="text-xs text-muted-foreground">-8.3% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12,450</div>
              <p className="text-xs text-muted-foreground">-5.7% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Per Customer</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125g</div>
              <p className="text-xs text-muted-foreground">-12.4% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹8,750</div>
              <p className="text-xs text-muted-foreground">Based on AI recommendations</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="metrics">Waste Metrics</TabsTrigger>
            <TabsTrigger value="financial">Financial Impact</TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="heatmap">Waste Heat Map</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Food Waste by Category</CardTitle>
                  <CardDescription>Track waste across different food categories</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <RestaurantWasteMetrics timeframe={timeframe} chartType="bar" />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Waste Composition</CardTitle>
                  <CardDescription>Breakdown of food waste by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <RestaurantWasteMetrics timeframe={timeframe} chartType="pie" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Waste by Meal Period</CardTitle>
                <CardDescription>Track waste generation across different meal periods</CardDescription>
              </CardHeader>
              <CardContent>
                <RestaurantWasteMetrics timeframe={timeframe} chartType="line" mealPeriod={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Wasted Menu Items</CardTitle>
                <CardDescription>Menu items with the highest waste percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Paneer Butter Masala", percentage: 18.5, quantity: "3.2 kg", cost: "₹1,280" },
                    { name: "Veg Biryani", percentage: 15.2, quantity: "2.8 kg", cost: "₹980" },
                    { name: "Chicken Tikka", percentage: 12.7, quantity: "2.4 kg", cost: "₹1,450" },
                    { name: "Garlic Naan", percentage: 10.3, quantity: "1.9 kg", cost: "₹760" },
                    { name: "Gulab Jamun", percentage: 8.6, quantity: "1.6 kg", cost: "₹640" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1/3 md:w-1/4">
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="w-2/3 md:w-3/4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${item.percentage * 3}%` }}
                              />
                              <span className="ml-2 text-sm text-muted-foreground">{item.percentage}%</span>
                            </div>
                          </div>
                          <div className="hidden md:block w-24 text-sm">{item.quantity}</div>
                          <div className="hidden md:block w-24 text-sm">{item.cost}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <RestaurantFinancialImpact timeframe={timeframe} />
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <RestaurantWasteSuggestions />
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <RestaurantWasteHeatMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

