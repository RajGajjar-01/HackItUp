"use client"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function RestaurantWasteMetrics({
  timeframe,
  chartType = "line",
  mealPeriod = false,
}) {
  // Sample data for different timeframes
  const dailyData = [
    { name: "Mon", produce: 12.5, meat: 8.2, dairy: 6.4, prepared: 15.8, bakery: 5.6 },
    { name: "Tue", produce: 10.8, meat: 7.5, dairy: 5.9, prepared: 14.2, bakery: 4.8 },
    { name: "Wed", produce: 14.2, meat: 9.1, dairy: 7.2, prepared: 16.5, bakery: 6.2 },
    { name: "Thu", produce: 13.6, meat: 8.8, dairy: 6.8, prepared: 15.9, bakery: 5.9 },
    { name: "Fri", produce: 15.4, meat: 10.2, dairy: 7.8, prepared: 18.2, bakery: 6.8 },
    { name: "Sat", produce: 18.2, meat: 12.5, dairy: 9.2, prepared: 22.5, bakery: 8.2 },
    { name: "Sun", produce: 16.8, meat: 11.4, dairy: 8.5, prepared: 20.8, bakery: 7.5 },
  ]

  const weeklyData = [
    { name: "Week 1", produce: 85.5, meat: 58.2, dairy: 42.4, prepared: 105.8, bakery: 38.6 },
    { name: "Week 2", produce: 82.8, meat: 55.5, dairy: 40.9, prepared: 102.2, bakery: 36.8 },
    { name: "Week 3", produce: 88.2, meat: 60.1, dairy: 44.2, prepared: 110.5, bakery: 40.2 },
    { name: "Week 4", produce: 86.6, meat: 59.8, dairy: 43.8, prepared: 108.9, bakery: 39.9 },
  ]

  const monthlyData = [
    { name: "Jan", produce: 350.5, meat: 240.2, dairy: 180.4, prepared: 420.8, bakery: 150.6 },
    { name: "Feb", produce: 320.8, meat: 220.5, dairy: 165.9, prepared: 390.2, bakery: 140.8 },
    { name: "Mar", produce: 380.2, meat: 260.1, dairy: 195.2, prepared: 450.5, bakery: 165.2 },
    { name: "Apr", produce: 360.6, meat: 245.8, dairy: 185.8, prepared: 430.9, bakery: 155.9 },
    { name: "May", produce: 390.4, meat: 270.2, dairy: 200.8, prepared: 470.2, bakery: 170.8 },
    { name: "Jun", produce: 410.2, meat: 285.5, dairy: 210.2, prepared: 490.5, bakery: 180.2 },
  ]

  const pieData = [
    { name: "Prepared Food", value: 42, color: "#f97316" },
    { name: "Produce", value: 25, color: "#10b981" },
    { name: "Meat", value: 15, color: "#ef4444" },
    { name: "Dairy", value: 10, color: "#3b82f6" },
    { name: "Bakery", value: 8, color: "#f59e0b" },
  ]

  const mealPeriodData = {
    daily: [
      { name: "Breakfast", produce: 4.2, meat: 2.5, dairy: 3.8, prepared: 5.2, bakery: 3.2 },
      { name: "Lunch", produce: 8.5, meat: 6.8, dairy: 4.2, prepared: 12.5, bakery: 3.8 },
      { name: "Dinner", produce: 10.2, meat: 8.5, dairy: 5.5, prepared: 15.8, bakery: 4.5 },
      { name: "Late Night", produce: 2.5, meat: 1.8, dairy: 1.2, prepared: 3.5, bakery: 1.2 },
    ],
    weekly: [
      { name: "Breakfast", produce: 29.4, meat: 17.5, dairy: 26.6, prepared: 36.4, bakery: 22.4 },
      { name: "Lunch", produce: 59.5, meat: 47.6, dairy: 29.4, prepared: 87.5, bakery: 26.6 },
      { name: "Dinner", produce: 71.4, meat: 59.5, dairy: 38.5, prepared: 110.6, bakery: 31.5 },
      { name: "Late Night", produce: 17.5, meat: 12.6, dairy: 8.4, prepared: 24.5, bakery: 8.4 },
    ],
    monthly: [
      { name: "Breakfast", produce: 125.4, meat: 75.5, dairy: 114.6, prepared: 156.4, bakery: 96.4 },
      { name: "Lunch", produce: 255.5, meat: 204.6, dairy: 126.4, prepared: 375.5, bakery: 114.6 },
      { name: "Dinner", produce: 306.4, meat: 255.5, dairy: 165.5, prepared: 474.6, bakery: 135.5 },
      { name: "Late Night", produce: 75.5, meat: 54.6, dairy: 36.4, prepared: 105.5, bakery: 36.4 },
    ],
  }

  // Select data based on timeframe
  const data = timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData

  const mealData = mealPeriodData[timeframe]

  if (chartType === "pie") {
    return (
      <div width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    )
  }

  if (mealPeriod) {
    return (
      <div width="100%" height={350}>
        <BarChart data={mealData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="prepared" name="Prepared Food" fill="#f97316" />
          <Bar dataKey="produce" name="Produce" fill="#10b981" />
          <Bar dataKey="meat" name="Meat" fill="#ef4444" />
          <Bar dataKey="dairy" name="Dairy" fill="#3b82f6" />
          <Bar dataKey="bakery" name="Bakery" fill="#f59e0b" />
        </BarChart>
      </div>
    )
  }

  if (chartType === "bar") {
    return (
      <div width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="prepared" name="Prepared Food" fill="#f97316" />
          <Bar dataKey="produce" name="Produce" fill="#10b981" />
          <Bar dataKey="meat" name="Meat" fill="#ef4444" />
          <Bar dataKey="dairy" name="Dairy" fill="#3b82f6" />
          <Bar dataKey="bakery" name="Bakery" fill="#f59e0b" />
        </BarChart>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="prepared" name="Prepared Food" stroke="#f97316" />
        <Line type="monotone" dataKey="produce" name="Produce" stroke="#10b981" />
        <Line type="monotone" dataKey="meat" name="Meat" stroke="#ef4444" />
        <Line type="monotone" dataKey="dairy" name="Dairy" stroke="#3b82f6" />
        <Line type="monotone" dataKey="bakery" name="Bakery" stroke="#f59e0b" />
      </LineChart>
    </ResponsiveContainer>
  )
}

