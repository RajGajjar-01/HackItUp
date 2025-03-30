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

export function WasteGenerationMetrics({ timeframe, chartType = "line" }) {
  // Sample data for different timeframes
  const dailyData = [
    { name: "Mon", organic: 65, plastic: 28, paper: 42, metal: 15, glass: 20, other: 30 },
    { name: "Tue", organic: 59, plastic: 32, paper: 38, metal: 12, glass: 18, other: 25 },
    { name: "Wed", organic: 80, plastic: 27, paper: 40, metal: 18, glass: 22, other: 28 },
    { name: "Thu", organic: 81, plastic: 30, paper: 45, metal: 16, glass: 19, other: 32 },
    { name: "Fri", organic: 76, plastic: 35, paper: 48, metal: 20, glass: 25, other: 35 },
    { name: "Sat", organic: 55, plastic: 25, paper: 32, metal: 10, glass: 15, other: 20 },
    { name: "Sun", organic: 40, plastic: 20, paper: 28, metal: 8, glass: 12, other: 18 },
  ]

  const weeklyData = [
    { name: "Week 1", organic: 420, plastic: 180, paper: 250, metal: 90, glass: 120, other: 180 },
    { name: "Week 2", organic: 380, plastic: 195, paper: 230, metal: 85, glass: 110, other: 170 },
    { name: "Week 3", organic: 450, plastic: 210, paper: 270, metal: 100, glass: 130, other: 190 },
    { name: "Week 4", organic: 400, plastic: 200, paper: 260, metal: 95, glass: 125, other: 185 },
  ]

  const monthlyData = [
    { name: "Jan", organic: 1800, plastic: 780, paper: 1050, metal: 380, glass: 520, other: 750 },
    { name: "Feb", organic: 1650, plastic: 720, paper: 980, metal: 350, glass: 480, other: 700 },
    { name: "Mar", organic: 1900, plastic: 820, paper: 1100, metal: 400, glass: 550, other: 800 },
    { name: "Apr", organic: 1750, plastic: 750, paper: 1020, metal: 370, glass: 510, other: 730 },
    { name: "May", organic: 1850, plastic: 800, paper: 1080, metal: 390, glass: 530, other: 770 },
    { name: "Jun", organic: 2000, plastic: 850, paper: 1150, metal: 420, glass: 570, other: 830 },
  ]

  const pieData = [
    { name: "Organic", value: 45, color: "#10b981" },
    { name: "Plastic", value: 20, color: "#3b82f6" },
    { name: "Paper", value: 15, color: "#f59e0b" },
    { name: "Metal", value: 8, color: "#6366f1" },
    { name: "Glass", value: 7, color: "#ec4899" },
    { name: "Other", value: 5, color: "#8b5cf6" },
  ]

  // Select data based on timeframe
  const data = timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={300}>
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
      </ResponsiveContainer>
    )
  }

  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="organic" fill="#10b981" name="Organic" />
          <Bar dataKey="plastic" fill="#3b82f6" name="Plastic" />
          <Bar dataKey="paper" fill="#f59e0b" name="Paper" />
          <Bar dataKey="metal" fill="#6366f1" name="Metal" />
          <Bar dataKey="glass" fill="#ec4899" name="Glass" />
          <Bar dataKey="other" fill="#8b5cf6" name="Other" />
        </BarChart>
      </ResponsiveContainer>
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
        <Line type="monotone" dataKey="organic" stroke="#10b981" name="Organic" />
        <Line type="monotone" dataKey="plastic" stroke="#3b82f6" name="Plastic" />
        <Line type="monotone" dataKey="paper" stroke="#f59e0b" name="Paper" />
        <Line type="monotone" dataKey="metal" stroke="#6366f1" name="Metal" />
        <Line type="monotone" dataKey="glass" stroke="#ec4899" name="Glass" />
        <Line type="monotone" dataKey="other" stroke="#8b5cf6" name="Other" />
      </LineChart>
    </ResponsiveContainer>
  )
}

