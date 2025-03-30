"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RestaurantWasteHeatMap() {
  const [wasteType, setWasteType] = useState("total")
  const [viewType, setViewType] = useState("daily")

  // Generate sample data for the heat map
  const generateHeatMapData = (type, view) => {
    if (view === "daily") {
      const hours = Array.from({ length: 24 }, (_, i) => i)
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

      const baseValues = {
        total: 100,
        prepared: 42,
        produce: 25,
        meat: 15,
        dairy: 10,
        bakery: 8,
      }

      const baseValue = baseValues[type] || 100

      return hours.flatMap((hour) => {
        return days.map((day) => {
          // Create patterns based on time of day and day of week
          const isWeekend = day === "Saturday" || day === "Sunday"
          const isBreakfastHour = hour >= 7 && hour <= 10
          const isLunchHour = hour >= 12 && hour <= 15
          const isDinnerHour = hour >= 18 && hour <= 22

          let value = baseValue * 0.1 // Base low value

          // Meal times have more waste
          if (isBreakfastHour) value = baseValue * 0.6
          if (isLunchHour) value = baseValue * 0.9
          if (isDinnerHour) value = baseValue

          // Weekends have different patterns
          if (isWeekend && isDinnerHour) value *= 1.2

          // Add some randomness
          value *= 0.8 + Math.random() * 0.4

          return {
            day,
            hour,
            value: Math.round(value),
          }
        })
      })
    } else {
      // Weekly view - by day and meal period
      const mealPeriods = ["Breakfast", "Lunch", "Dinner", "Late Night"]
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

      const baseValues = {
        total: 100,
        prepared: 42,
        produce: 25,
        meat: 15,
        dairy: 10,
        bakery: 8,
      }

      const baseValue = baseValues[type] || 100

      return mealPeriods.flatMap((period) => {
        return days.map((day) => {
          // Create patterns based on meal period and day of week
          const isWeekend = day === "Saturday" || day === "Sunday"
          const isBreakfast = period === "Breakfast"
          const isLunch = period === "Lunch"
          const isDinner = period === "Dinner"
          const isLateNight = period === "Late Night"

          let value = baseValue * 0.1 // Base low value

          // Meal times have different waste levels
          if (isBreakfast) value = baseValue * 0.5
          if (isLunch) value = baseValue * 0.8
          if (isDinner) value = baseValue
          if (isLateNight) value = baseValue * 0.3

          // Weekends have different patterns
          if (isWeekend && isDinner) value *= 1.2
          if (isWeekend && isLateNight) value *= 1.5

          // Add some randomness
          value *= 0.8 + Math.random() * 0.4

          return {
            day,
            period,
            value: Math.round(value),
          }
        })
      })
    }
  }

  const data = generateHeatMapData(wasteType, viewType)
  const maxValue = Math.max(...data.map((d) => d.value))

  const getColorForValue = (value, max) => {
    // Calculate color based on value (from green to red)
    const ratio = value / max
    const r = Math.floor(255 * ratio)
    const g = Math.floor(255 * (1 - ratio))
    const b = 0
    return `rgb(${r}, ${g}, ${b}, ${0.1 + ratio * 0.7})`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Food Waste Heat Map</CardTitle>
              <CardDescription>Visualize waste patterns by time and day</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={wasteType} onValueChange={setWasteType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Waste Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total Waste</SelectItem>
                  <SelectItem value="prepared">Prepared Food</SelectItem>
                  <SelectItem value="produce">Produce</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                </SelectContent>
              </Select>

              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Hourly View</SelectItem>
                  <SelectItem value="weekly">Meal Period View</SelectItem>
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

            {viewType === "daily" ? (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="flex">
                    <div className="w-16 flex-shrink-0"></div>
                    <div className="flex flex-grow">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex-1 text-center text-xs font-medium">
                          {day.substring(0, 3)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="flex">
                      <div className="w-16 flex-shrink-0 text-xs flex items-center justify-end pr-2">
                        {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                      </div>
                      <div className="flex flex-grow">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const dayData = data.find((d) => d.day === day && d.hour === hour)
                          const value = dayData ? dayData.value : 0
                          return (
                            <div
                              key={day}
                              className="flex-1 h-6 border border-gray-100"
                              style={{ backgroundColor: getColorForValue(value, maxValue) }}
                              title={`Day: ${day}, Hour: ${hour}, Value: ${value}`}
                            ></div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="flex">
                    <div className="w-24 flex-shrink-0"></div>
                    <div className="flex flex-grow">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex-1 text-center text-xs font-medium">
                          {day.substring(0, 3)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {["Breakfast", "Lunch", "Dinner", "Late Night"].map((period) => (
                    <div key={period} className="flex">
                      <div className="w-24 flex-shrink-0 text-xs flex items-center justify-end pr-2">{period}</div>
                      <div className="flex flex-grow">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const periodData = data.find((d) => d.day === day && d.period === period)
                          const value = periodData ? periodData.value : 0
                          return (
                            <div
                              key={day}
                              className="flex-1 h-12 border border-gray-100"
                              style={{ backgroundColor: getColorForValue(value, maxValue) }}
                              title={`Day: ${day}, Period: ${period}, Value: ${value}`}
                            >
                              <div className="flex h-full items-center justify-center text-xs font-medium">
                                {value > maxValue * 0.7 ? value : ""}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waste Pattern Insights</CardTitle>
          <CardDescription>AI-generated insights based on restaurant waste patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Peak Waste Periods</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Dinner service (6-10 PM) generates 45% of total daily waste, with Saturday dinner showing the highest
                waste levels. Consider implementing targeted waste reduction strategies during these peak periods.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Menu Item Correlation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                PetPooja data shows that items with complex preparation requirements (Paneer Butter Masala, Veg Biryani)
                have higher waste percentages during busy periods. Consider simplifying preparation methods during peak
                times.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Inventory Management</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Produce waste peaks on Mondays, suggesting weekend over-ordering. Adjust your PetPooja inventory
                management to reduce Sunday/Monday morning deliveries by 15-20%.
              </p>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-medium">Recommended Actions</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Implement batch cooking for high-waste items during dinner service</li>
                <li>• Adjust prep quantities based on day-of-week patterns</li>
                <li>• Create a "Sunday special" menu to utilize weekend inventory before Monday</li>
                <li>• Train staff on portion control during peak waste periods</li>
                <li>• Use PetPooja's inventory forecasting to optimize order quantities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

