"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function FinancialReports() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly")

  // Sample financial data
  const financialData = {
    daily: [
      { date: "Mon", disposal: 320, recycling: 120, labor: 180, transportation: 150, savings: 80 },
      { date: "Tue", disposal: 300, recycling: 110, labor: 170, transportation: 140, savings: 75 },
      { date: "Wed", disposal: 340, recycling: 130, labor: 190, transportation: 160, savings: 85 },
      { date: "Thu", disposal: 360, recycling: 140, labor: 200, transportation: 170, savings: 90 },
      { date: "Fri", disposal: 380, recycling: 150, labor: 210, transportation: 180, savings: 95 },
      { date: "Sat", disposal: 280, recycling: 100, labor: 160, transportation: 130, savings: 70 },
      { date: "Sun", disposal: 240, recycling: 90, labor: 140, transportation: 110, savings: 60 },
    ],
    weekly: [
      { date: "Week 1", disposal: 2200, recycling: 840, labor: 1250, transportation: 1050, savings: 550 },
      { date: "Week 2", disposal: 2100, recycling: 800, labor: 1200, transportation: 1000, savings: 520 },
      { date: "Week 3", disposal: 2300, recycling: 880, labor: 1300, transportation: 1100, savings: 580 },
      { date: "Week 4", disposal: 2250, recycling: 860, labor: 1270, transportation: 1070, savings: 560 },
    ],
    monthly: [
      { date: "Jan", disposal: 9500, recycling: 3600, labor: 5400, transportation: 4500, savings: 2400 },
      { date: "Feb", disposal: 8800, recycling: 3400, labor: 5000, transportation: 4200, savings: 2200 },
      { date: "Mar", disposal: 10200, recycling: 3900, labor: 5800, transportation: 4800, savings: 2600 },
      { date: "Apr", disposal: 9800, recycling: 3700, labor: 5600, transportation: 4600, savings: 2500 },
      { date: "May", disposal: 10500, recycling: 4000, labor: 6000, transportation: 5000, savings: 2700 },
      { date: "Jun", disposal: 11000, recycling: 4200, labor: 6200, transportation: 5200, savings: 2800 },
    ],
  }

  const costBreakdownData = [
    { name: "Disposal Fees", value: 45 },
    { name: "Recycling Costs", value: 17 },
    { name: "Labor", value: 25 },
    { name: "Transportation", value: 13 },
  ]

  const savingsData = {
    daily: [
      { date: "Mon", actual: 320, projected: 400 },
      { date: "Tue", actual: 300, projected: 390 },
      { date: "Wed", actual: 340, projected: 420 },
      { date: "Thu", actual: 360, projected: 440 },
      { date: "Fri", actual: 380, projected: 460 },
      { date: "Sat", actual: 280, projected: 350 },
      { date: "Sun", actual: 240, projected: 300 },
    ],
    weekly: [
      { date: "Week 1", actual: 2200, projected: 2750 },
      { date: "Week 2", actual: 2100, projected: 2600 },
      { date: "Week 3", actual: 2300, projected: 2850 },
      { date: "Week 4", actual: 2250, projected: 2800 },
    ],
    monthly: [
      { date: "Jan", actual: 9500, projected: 11900 },
      { date: "Feb", actual: 8800, projected: 11000 },
      { date: "Mar", actual: 10200, projected: 12700 },
      { date: "Apr", actual: 9800, projected: 12200 },
      { date: "May", actual: 10500, projected: 13100 },
      { date: "Jun", actual: 11000, projected: 13700 },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Waste Management Costs</CardTitle>
              <CardDescription>Financial breakdown of waste management expenses</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="daily"
                  onClick={() => setTimeframe("daily")}
                  className={timeframe === "daily" ? "bg-primary text-primary-foreground" : ""}
                >
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  onClick={() => setTimeframe("weekly")}
                  className={timeframe === "weekly" ? "bg-primary text-primary-foreground" : ""}
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  onClick={() => setTimeframe("monthly")}
                  className={timeframe === "monthly" ? "bg-primary text-primary-foreground" : ""}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={financialData[timeframe]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="disposal" name="Disposal Fees" fill="#ef4444" />
              <Bar dataKey="recycling" name="Recycling Costs" fill="#3b82f6" />
              <Bar dataKey="labor" name="Labor" fill="#f59e0b" />
              <Bar dataKey="transportation" name="Transportation" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>Percentage of total waste management costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costBreakdownData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-1/3">
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="w-2/3">
                  <div className="flex items-center">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor:
                          item.name === "Disposal Fees"
                            ? "#ef4444"
                            : item.name === "Recycling Costs"
                              ? "#3b82f6"
                              : item.name === "Labor"
                                ? "#f59e0b"
                                : "#8b5cf6",
                      }}
                    />
                    <span className="ml-2 text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Cost Savings Analysis</CardTitle>
          <CardDescription>Actual costs vs. projected costs without optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={savingsData[timeframe]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="projected" name="Projected Costs" stroke="#ef4444" fill="#fee2e2" />
              <Area type="monotone" dataKey="actual" name="Actual Costs" stroke="#10b981" fill="#d1fae5" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>ROI Analysis</CardTitle>
          <CardDescription>Return on investment for waste reduction initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Total Investment</h3>
              <p className="text-3xl font-bold mt-2">$24,500</p>
              <p className="text-sm text-muted-foreground mt-1">In waste reduction technologies</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Annual Savings</h3>
              <p className="text-3xl font-bold mt-2">$32,400</p>
              <p className="text-sm text-muted-foreground mt-1">Projected for current fiscal year</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium">ROI</h3>
              <p className="text-3xl font-bold mt-2">132%</p>
              <p className="text-sm text-muted-foreground mt-1">9-month payback period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

