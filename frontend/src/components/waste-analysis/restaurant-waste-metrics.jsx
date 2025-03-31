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
  timeframe = "daily",
  chartType = "line",
  mealPeriod = false,
}) {
  // Sample data for different timeframes focused on produce
  const dailyData = [
    { name: "Mon", fruits: 8.2, vegetables: 12.5, leafyGreens: 6.4, preparedVeg: 5.8 },
    { name: "Tue", fruits: 7.5, vegetables: 10.8, leafyGreens: 5.9, preparedVeg: 4.2 },
    { name: "Wed", fruits: 9.1, vegetables: 14.2, leafyGreens: 7.2, preparedVeg: 6.5 },
    { name: "Thu", fruits: 8.8, vegetables: 13.6, leafyGreens: 6.8, preparedVeg: 5.9 },
    { name: "Fri", fruits: 10.2, vegetables: 15.4, leafyGreens: 7.8, preparedVeg: 8.2 },
    { name: "Sat", fruits: 12.5, vegetables: 18.2, leafyGreens: 9.2, preparedVeg: 12.5 },
    { name: "Sun", fruits: 11.4, vegetables: 16.8, leafyGreens: 8.5, preparedVeg: 10.8 },
  ]

  const weeklyData = [
    { name: "Week 1", fruits: 58.2, vegetables: 85.5, leafyGreens: 42.4, preparedVeg: 35.8 },
    { name: "Week 2", fruits: 55.5, vegetables: 82.8, leafyGreens: 40.9, preparedVeg: 32.2 },
    { name: "Week 3", fruits: 60.1, vegetables: 88.2, leafyGreens: 44.2, preparedVeg: 40.5 },
    { name: "Week 4", fruits: 59.8, vegetables: 86.6, leafyGreens: 43.8, preparedVeg: 38.9 },
  ]

  const monthlyData = [
    { name: "Jan", fruits: 240.2, vegetables: 350.5, leafyGreens: 180.4, preparedVeg: 150.8 },
    { name: "Feb", fruits: 220.5, vegetables: 320.8, leafyGreens: 165.9, preparedVeg: 140.2 },
    { name: "Mar", fruits: 260.1, vegetables: 380.2, leafyGreens: 195.2, preparedVeg: 170.5 },
    { name: "Apr", fruits: 245.8, vegetables: 360.6, leafyGreens: 185.8, preparedVeg: 160.9 },
    { name: "May", fruits: 270.2, vegetables: 390.4, leafyGreens: 200.8, preparedVeg: 180.2 },
    { name: "Jun", fruits: 285.5, vegetables: 410.2, leafyGreens: 210.2, preparedVeg: 200.5 },
  ]

  const pieData = [
    { name: "Vegetables", value: 45, color: "#10b981" },
    { name: "Fruits", value: 30, color: "#f59e0b" },
    { name: "Leafy Greens", value: 15, color: "#84cc16" },
    { name: "Prepared Veg", value: 10, color: "#f97316" },
  ]

  const mealPeriodData = {
    daily: [
      { name: "Breakfast", fruits: 2.5, vegetables: 3.2, leafyGreens: 1.8, preparedVeg: 1.2 },
      { name: "Lunch", fruits: 4.8, vegetables: 6.5, leafyGreens: 3.2, preparedVeg: 2.8 },
      { name: "Dinner", fruits: 5.5, vegetables: 8.2, leafyGreens: 4.5, preparedVeg: 4.5 },
      { name: "Late Night", fruits: 1.2, vegetables: 1.5, leafyGreens: 0.8, preparedVeg: 0.5 },
    ],
    weekly: [
      { name: "Breakfast", fruits: 17.5, vegetables: 22.4, leafyGreens: 12.6, preparedVeg: 8.4 },
      { name: "Lunch", fruits: 33.6, vegetables: 45.5, leafyGreens: 22.4, preparedVeg: 19.6 },
      { name: "Dinner", fruits: 38.5, vegetables: 57.4, leafyGreens: 31.5, preparedVeg: 31.5 },
      { name: "Late Night", fruits: 8.4, vegetables: 10.5, leafyGreens: 5.6, preparedVeg: 3.5 },
    ],
    monthly: [
      { name: "Breakfast", fruits: 75.5, vegetables: 96.4, leafyGreens: 54.6, preparedVeg: 36.4 },
      { name: "Lunch", fruits: 144.6, vegetables: 195.5, leafyGreens: 96.4, preparedVeg: 84.6 },
      { name: "Dinner", fruits: 165.5, vegetables: 246.4, leafyGreens: 135.5, preparedVeg: 135.5 },
      { name: "Late Night", fruits: 36.4, vegetables: 45.5, leafyGreens: 24.6, preparedVeg: 15.5 },
    ],
  }

  // Select data based on timeframe
  const data = timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData
  const mealData = mealPeriodData[timeframe]

  if (chartType === "pie") {
    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Waste Percentage']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (mealPeriod) {
    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mealData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Waste (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value} kg`, 'Waste']} />
            <Legend />
            <Bar dataKey="vegetables" name="Vegetables" fill="#10b981" />
            <Bar dataKey="fruits" name="Fruits" fill="#f59e0b" />
            <Bar dataKey="leafyGreens" name="Leafy Greens" fill="#84cc16" />
            <Bar dataKey="preparedVeg" name="Prepared Veg" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "bar") {
    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Waste (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value} kg`, 'Waste']} />
            <Legend />
            <Bar dataKey="vegetables" name="Vegetables" fill="#10b981" />
            <Bar dataKey="fruits" name="Fruits" fill="#f59e0b" />
            <Bar dataKey="leafyGreens" name="Leafy Greens" fill="#84cc16" />
            <Bar dataKey="preparedVeg" name="Prepared Veg" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default line chart
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Waste (kg)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [`${value} kg`, 'Waste']} />
          <Legend />
          <Line type="monotone" dataKey="vegetables" name="Vegetables" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="fruits" name="Fruits" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="leafyGreens" name="Leafy Greens" stroke="#84cc16" strokeWidth={2} />
          <Line type="monotone" dataKey="preparedVeg" name="Prepared Veg" stroke="#f97316" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}