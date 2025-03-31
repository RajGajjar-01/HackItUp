"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, BarChart, Calendar, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RevenueChart() {
  const [chartType, setChartType] = useState("line")
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("month") // "week", "month", "year"
  const [error, setError] = useState(null)

  // Fetch sales data from backend
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:3000/api/sales?restaurantId=1814d447-13f8-4b35-b504-b7f2c998be4a')
        
        if (!response.ok) {
          throw new Error('Failed to fetch sales data')
        }
        
        const data = await response.json()
        setSalesData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching sales data:", err)
        setError("Failed to load sales data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [dateRange])

  // Process sales data for the chart
  const processChartData = () => {
    if (!salesData || salesData.length === 0) return { points: [], dates: [], totalRevenue: 0, highDay: null, lowDay: null }

    // Group sales by date
    const salesByDate = salesData.reduce((acc, sale) => {
      const date = new Date(sale.date).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, revenue: 0 }
      }
      acc[date].revenue += sale.revenue
      return acc
    }, {})

    // Sort by date
    const sortedSales = Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // Generate chart points
    const chartWidth = 420
    const chartHeight = 160
    const startX = 50
    const startY = 180
    const padding = chartWidth / (sortedSales.length > 1 ? sortedSales.length - 1 : 1)
    
    // Find min/max for scaling
    const maxRevenue = Math.max(...sortedSales.map(sale => sale.revenue))
    
    // Generate points
    const points = sortedSales.map((sale, index) => {
      const x = startX + (index * padding)
      // Invert Y scale (SVG has 0,0 at top-left)
      const y = startY - ((sale.revenue / maxRevenue) * chartHeight)
      return { x, y, revenue: sale.revenue, date: sale.date }
    })

    // Calculate metrics
    const totalRevenue = sortedSales.reduce((sum, sale) => sum + sale.revenue, 0)
    
    // Find highest and lowest days
    const highDay = [...sortedSales].sort((a, b) => b.revenue - a.revenue)[0]
    const lowDay = [...sortedSales].sort((a, b) => a.revenue - b.revenue)[0]

    return { 
      points,
      dates: sortedSales.map(sale => sale.date),
      totalRevenue,
      highDay,
      lowDay
    }
  }

  const { points, dates, totalRevenue, highDay, lowDay } = processChartData()

  // Format points for SVG polyline
  const polylinePoints = points.map(point => `${point.x},${point.y}`).join(' ')
  
  // Format points for SVG area path
  const areaPath = points.length > 0 ? `
    M${points[0].x},${points[0].y}
    ${points.map(point => `L${point.x},${point.y}`).join(' ')}
    L${points[points.length - 1].x},180
    L${points[0].x},180
    Z
  ` : ''

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
  }

  // Handle download
  const handleDownload = () => {
    if (!salesData || salesData.length === 0) return
    
    // Convert salesData to CSV
    const headers = "Date,Revenue,Quantity\n"
    const csvData = salesData.map(sale => 
      `${new Date(sale.date).toISOString().split('T')[0]},${sale.revenue},${sale.quantitySold}`
    ).join('\n')
    
    const blob = new Blob([headers + csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revenue-data-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg">Revenue Trend</CardTitle>
          <CardDescription>Daily revenue for the selected period</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="icon"
            onClick={() => setChartType("line")}
          >
            <LineChart className="h-4 w-4" />
          </Button>
          <div className="flex border rounded-md">
            <Button 
              variant={dateRange === "week" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setDateRange("week")}
              className="h-8 px-2"
            >
              Week
            </Button>
            <Button 
              variant={dateRange === "month" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setDateRange("month")}
              className="h-8 px-2"
            >
              Month
            </Button>
            <Button 
              variant={dateRange === "year" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setDateRange("year")}
              className="h-8 px-2"
            >
              Year
            </Button>
          </div>
         
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="h-full w-full flex items-center justify-center text-center text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : salesData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-center text-muted-foreground">
              <p>No sales data available for the selected period</p>
            </div>
          ) : chartType === "line" ? (
            <div className="h-full w-full flex items-center justify-center">
              <svg viewBox="0 0 500 200" className="h-full w-full">
                {/* X-axis */}
                <line x1="50" y1="180" x2="480" y2="180" stroke="currentColor" strokeWidth="1" />

                {/* Y-axis */}
                <line x1="50" y1="20" x2="50" y2="180" stroke="currentColor" strokeWidth="1" />

                {/* Data points */}
                {points.length > 0 && (
                  <>
                    <polyline
                      points={polylinePoints}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />

                    {/* Area under the line */}
                    <path
                      d={areaPath}
                      fill="blue"
                      opacity={0.4}
                    />

                 
                  </>
                )}

                {/* X-axis labels */}
                {dates.length > 0 && (
                  <>
                    {dates.filter((_, i) => i % Math.ceil(dates.length / 8) === 0 || i === dates.length - 1).map((date, i, filteredDates) => {
                      const index = dates.indexOf(date)
                      const x = points[index].x
                      return (
                        <text key={i} x={x} y="195" fontSize="8" textAnchor="middle">
                          {formatDate(date)}
                        </text>
                      )
                    })}
                  </>
                )}

                {/* Y-axis labels */}
                <text x="40" y="180" fontSize="8" textAnchor="end">
                  $0
                </text>
                <text x="40" y="140" fontSize="8" textAnchor="end">
                  $50
                </text>
                <text x="40" y="100" fontSize="8" textAnchor="end">
                  $100
                </text>
                <text x="40" y="60" fontSize="8" textAnchor="end">
                  $150
                </text>
                <text x="40" y="20" fontSize="8" textAnchor="end">
                  $200
                </text>
              </svg>
            </div>
          ) : (
            <div className="h-full w-full flex items-end justify-between px-10 py-4">
              {points.map((point, i) => (
                <div
                  key={i}
                  className="w-6 bg-primary rounded-t transition-all duration-500 ease-in-out relative group"
                  style={{
                    height: `${(point.revenue / (highDay?.revenue || 1)) * 80}%`,
                    minHeight: "10%"
                  }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background border px-2 py-1 rounded text-xs whitespace-nowrap">
                    {formatDate(point.date)}: {formatCurrency(point.revenue)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div>
            <p className="text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue || 0)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Highest Day</p>
            <p className="text-lg font-semibold">{highDay ? `${formatDate(highDay.date)} (${formatCurrency(highDay.revenue)})` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Lowest Day</p>
            <p className="text-lg font-semibold">{lowDay ? `${formatDate(lowDay.date)} (${formatCurrency(lowDay.revenue)})` : 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}