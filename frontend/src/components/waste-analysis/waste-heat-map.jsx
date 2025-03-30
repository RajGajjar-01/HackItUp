"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function WasteHeatMap() {
  const [wasteType, setWasteType] = useState("total")
  const [month, setMonth] = useState("current")

  // Generate sample data for the heat map
  const generateHeatMapData = (type, monthOffset) => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const baseValues = {
      total: 100,
      organic: 45,
      plastic: 20,
      paper: 15,
      metal: 8,
      glass: 7,
      other: 5,
    }

    const baseValue = baseValues[type] || 100
    const multiplier = monthOffset === 0 ? 1 : monthOffset === -1 ? 0.9 : 1.1

    return hours.flatMap((hour) => {
      return days.map((day) => {
        // Create patterns based on time of day and day of week
        const isWeekend = day % 7 === 0 || day % 7 === 6
        const isBusinessHours = hour >= 8 && hour <= 17
        const isLunchHour = hour >= 11 && hour <= 13

        let value = baseValue * multiplier

        // Weekends have less waste
        if (isWeekend) value *= 0.6

        // Business hours have more waste
        if (isBusinessHours) value *= 1.5

        // Lunch hours have even more waste
        if (isLunchHour) value *= 1.3

        // Add some randomness
        value *= 0.8 + Math.random() * 0.4

        return {
          day,
          hour,
          value: Math.round(value),
        }
      })
    })
  }

  const getMonthData = (monthOffset) => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    return {
      name: date.toLocaleString("default", { month: "long" }),
      data: generateHeatMapData(wasteType, monthOffset),
    }
  }

  const currentMonth = getMonthData(0)
  const previousMonth = getMonthData(-1)

  const getColorForValue = (value, max) => {
    // Calculate color based on value (from green to red)
    const ratio = value / max
    const r = Math.floor(255 * ratio)
    const g = Math.floor(255 * (1 - ratio))
    const b = 0
    return `rgb(${r}, ${g}, ${b}, ${0.1 + ratio * 0.7})`
  }

  const data = month === "current" ? currentMonth.data : previousMonth.data
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Waste Generation Heat Map</CardTitle>
              <CardDescription>Visualize waste generation patterns by day and hour</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={wasteType} onValueChange={setWasteType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Waste Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total Waste</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">{currentMonth.name}</SelectItem>
                  <SelectItem value="previous">{previousMonth.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-end space-x-2">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 opacity-70"></div>
                <span className="ml-1 text-xs">Low</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500 opacity-70"></div>
                <span className="ml-1 text-xs">Medium</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 opacity-70"></div>
                <span className="ml-1 text-xs">High</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex">
                  <div className="w-12 flex-shrink-0"></div>
                  <div className="flex flex-grow">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <div key={day} className="flex-1 text-center text-xs">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="flex">
                    <div className="w-12 flex-shrink-0 text-xs flex items-center justify-end pr-2">{hour}:00</div>
                    <div className="flex flex-grow">
                      {Array.from({ length: 31 }, (_, day) => {
                        const dayData = data.find((d) => d.day === day + 1 && d.hour === hour)
                        const value = dayData ? dayData.value : 0
                        return (
                          <div
                            key={day}
                            className="flex-1 h-6 border border-gray-100"
                            style={{ backgroundColor: getColorForValue(value, maxValue) }}
                            title={`Day: ${day + 1}, Hour: ${hour}:00, Value: ${value}`}
                          ></div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waste Pattern Insights</CardTitle>
          <CardDescription>AI-generated insights based on waste generation patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Peak Generation Times</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Waste generation peaks between 11:00 AM and 2:00 PM on weekdays, likely due to lunch activities.
                Consider increasing collection frequency during these hours.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Day-of-Week Patterns</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Monday and Friday show 15% higher waste generation compared to mid-week days. This suggests potential
                for optimized collection scheduling.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Anomaly Detection</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Unusual spikes detected on the 15th and 22nd of the month. Investigation recommended to identify
                potential process inefficiencies.
              </p>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-medium">Recommended Actions</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Adjust collection schedules to align with peak generation times</li>
                <li>• Implement targeted waste reduction campaigns during high-volume periods</li>
                <li>• Investigate process changes that could reduce weekday lunch hour waste</li>
                <li>• Consider specialized bins for peak waste types during high-volume periods</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

