
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, ArrowUpRight } from "lucide-react"



export default function TopSellingItems() {
  const [sortBy, setSortBy] = useState("revenue")
  const [topItems, setTopItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sales?restaurantId=1814d447-13f8-4b35-b504-b7f2c998be4a")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setTopItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sales data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const sortedItems = [...topItems]
    .sort((a, b) => sortBy === "revenue" ? b.revenue - a.revenue : b.quantitySold - a.quantitySold)
    .slice(0, 6)

  if (loading) return <div className="p-4 text-muted-foreground">Loading top items...</div>
  if (error) return <div className="p-4 text-destructive">Error: {error}</div>

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Top Selling Items
          </CardTitle>
          <div className="flex space-x-1">
            <Badge
              variant={sortBy === "quantity" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSortBy("quantity")}
            >
              By Quantity
            </Badge>
            <Badge
              variant={sortBy === "revenue" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSortBy("revenue")}
            >
              By Revenue
            </Badge>
          </div>
        </div>
        <CardDescription>Best performing menu items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">{item.recipe.name}</p>
                    {item.recipe.isSpecial && (
                      <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                        Special
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.recipe.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.revenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{item.quantitySold} sold</p>
                <p className="text-xs text-green-600 flex items-center justify-end">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  ${(item.quantitySold * item.recipe.price).toFixed(2)} total
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}