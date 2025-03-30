"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"


export function RestaurantFinancialImpact({ timeframe }) {
  // Sample financial data
  const financialData = {
    daily: [
      { date: "Mon", foodCost: 3200, wasteValue: 850, potentialSavings: 680 },
      { date: "Tue", foodCost: 2950, wasteValue: 780, potentialSavings: 620 },
      { date: "Wed", foodCost: 3400, wasteValue: 920, potentialSavings: 740 },
      { date: "Thu", foodCost: 3250, wasteValue: 880, potentialSavings: 700 },
      { date: "Fri", foodCost: 3800, wasteValue: 1050, potentialSavings: 840 },
      { date: "Sat", foodCost: 4500, wasteValue: 1250, potentialSavings: 1000 },
      { date: "Sun", foodCost: 4200, wasteValue: 1150, potentialSavings: 920 },
    ],
    weekly: [
      { date: "Week 1", foodCost: 25300, wasteValue: 6880, potentialSavings: 5500 },
      { date: "Week 2", foodCost: 24500, wasteValue: 6580, potentialSavings: 5260 },
      { date: "Week 3", foodCost: 26200, wasteValue: 7150, potentialSavings: 5720 },
      { date: "Week 4", foodCost: 25800, wasteValue: 6950, potentialSavings: 5560 },
    ],
    monthly: [
      { date: "Jan", foodCost: 108500, wasteValue: 29500, potentialSavings: 23600 },
      { date: "Feb", foodCost: 98200, wasteValue: 26500, potentialSavings: 21200 },
      { date: "Mar", foodCost: 115800, wasteValue: 31200, potentialSavings: 25000 },
      { date: "Apr", foodCost: 112500, wasteValue: 30400, potentialSavings: 24300 },
      { date: "May", foodCost: 118200, wasteValue: 32500, potentialSavings: 26000 },
      { date: "Jun", foodCost: 125500, wasteValue: 34200, potentialSavings: 27400 },
    ],
  }

  const wasteByCategory = [
    { name: "Prepared Food", value: 42, cost: 14700 },
    { name: "Produce", value: 25, cost: 8750 },
    { name: "Meat", value: 15, cost: 5250 },
    { name: "Dairy", value: 10, cost: 3500 },
    { name: "Bakery", value: 8, cost: 2800 },
  ]

  const wasteTrend = {
    daily: [
      { date: "Mon", percentage: 8.5 },
      { date: "Tue", percentage: 8.2 },
      { date: "Wed", percentage: 8.8 },
      { date: "Thu", percentage: 8.6 },
      { date: "Fri", percentage: 9.2 },
      { date: "Sat", percentage: 9.8 },
      { date: "Sun", percentage: 9.5 },
    ],
    weekly: [
      { date: "Week 1", percentage: 8.9 },
      { date: "Week 2", percentage: 8.7 },
      { date: "Week 3", percentage: 9.1 },
      { date: "Week 4", percentage: 8.8 },
    ],
    monthly: [
      { date: "Jan", percentage: 9.2 },
      { date: "Feb", percentage: 9.0 },
      { date: "Mar", percentage: 9.4 },
      { date: "Apr", percentage: 9.1 },
      { date: "May", percentage: 9.5 },
      { date: "Jun", percentage: 9.3 },
    ],
  }

  const data = financialData[timeframe]
  const trendData = wasteTrend[timeframe]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Impact of Food Waste</CardTitle>
          <CardDescription>Track the cost of food waste and potential savings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="foodCost" name="Total Food Cost" fill="#3b82f6" />
              <Bar dataKey="wasteValue" name="Waste Value" fill="#ef4444" />
              <Bar dataKey="potentialSavings" name="Potential Savings" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Waste as % of Food Cost</CardTitle>
            <CardDescription>Percentage of total food cost wasted</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 15]} />
                <Tooltip />
                <Line type="monotone" dataKey="percentage" name="Waste %" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Impact by Category</CardTitle>
            <CardDescription>Cost breakdown of wasted food by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wasteByCategory.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-1/3">
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="w-2/3">
                    <div className="flex items-center">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${item.value * 2}%`,
                          backgroundColor:
                            item.name === "Prepared Food"
                              ? "#f97316"
                              : item.name === "Produce"
                                ? "#10b981"
                                : item.name === "Meat"
                                  ? "#ef4444"
                                  : item.name === "Dairy"
                                    ? "#3b82f6"
                                    : "#f59e0b",
                        }}
                      />
                      <span className="ml-2 text-sm text-muted-foreground">₹{item.cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Key financial metrics related to food waste</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Monthly Food Cost</h3>
              <p className="text-3xl font-bold mt-2">₹1,25,500</p>
              <p className="text-sm text-muted-foreground mt-1">+6.2% from previous month</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Monthly Waste Value</h3>
              <p className="text-3xl font-bold mt-2">₹34,200</p>
              <p className="text-sm text-muted-foreground mt-1">9.3% of total food cost</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Waste Per Order</h3>
              <p className="text-3xl font-bold mt-2">₹42.50</p>
              <p className="text-sm text-muted-foreground mt-1">-3.8% from previous month</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Annual Waste Cost</h3>
              <p className="text-3xl font-bold mt-2">₹4,10,400</p>
              <p className="text-sm text-muted-foreground mt-1">Based on current trends</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-medium">Financial Insights:</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Reducing prepared food waste by 25% could save approximately ₹3,675 monthly</li>
              <li>• Implementing portion control could reduce waste costs by ₹8,550 annually</li>
              <li>• Optimizing inventory management could improve profit margins by 2.1%</li>
              <li>• Current waste levels represent approximately ₹4.1 lakhs in lost revenue annually</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

