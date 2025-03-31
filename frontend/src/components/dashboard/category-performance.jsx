"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Process the sales data to get category performance
const categoryData = [
  { name: "Main Course", revenue: 1245.5, percentage: 35, color: "bg-blue-500" },
  { name: "Salad", revenue: 635.75, percentage: 18, color: "bg-green-500" },
  { name: "Appetizer", revenue: 528.3, percentage: 15, color: "bg-amber-500" },
  { name: "Soup", revenue: 425.6, percentage: 12, color: "bg-red-500" },
  { name: "Dessert", revenue: 315.25, percentage: 9, color: "bg-purple-500" },
  { name: "Side Dish", revenue: 245.8, percentage: 7, color: "bg-indigo-500" },
  { name: "Breakfast", revenue: 149.75, percentage: 4, color: "bg-pink-500" },
]

export default function CategoryPerformance() {
  const [chartType, setChartType] = useState("pie")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg">Category Performance</CardTitle>
          <CardDescription>Sales by menu category</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={chartType === "pie" ? "default" : "outline"} size="icon" onClick={() => setChartType("pie")}>
            <PieChart className="h-4 w-4" />
          </Button>
          <Button variant={chartType === "bar" ? "default" : "outline"} size="icon" onClick={() => setChartType("bar")}>
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-square relative">
            {chartType === "pie" ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Simple pie chart visualization */}
                  <div
                    className="absolute inset-0 rounded-full border-8 border-blue-500"
                    style={{
                      clipPath: "polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0, 50% 0)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-green-500"
                    style={{ clipPath: "polygon(50% 50%, 0 0, 50% 0, 100% 0, 100% 30%)" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-amber-500"
                    style={{ clipPath: "polygon(50% 50%, 100% 30%, 100% 50%)" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-red-500"
                    style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 70%)" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-purple-500"
                    style={{ clipPath: "polygon(50% 50%, 100% 70%, 100% 85%)" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-indigo-500"
                    style={{ clipPath: "polygon(50% 50%, 100% 85%, 100% 100%, 80% 100%)" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-pink-500"
                    style={{ clipPath: "polygon(50% 50%, 80% 100%, 50% 100%)" }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-end justify-between px-2">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 ${category.color} rounded-t`}
                      style={{ height: `${category.percentage * 2}%` }}
                    ></div>
                    <span className="text-xs mt-1 rotate-45 origin-left">{category.name.substring(0, 3)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ${category.revenue.toFixed(2)} ({category.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

