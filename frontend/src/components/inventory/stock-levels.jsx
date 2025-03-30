import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, AlertTriangle } from "lucide-react"

// Sample data for stock levels
const stockItems = [
  { name: "Tomatoes", level: 85, unit: "kg", status: "normal" },
  { name: "Onions", level: 72, unit: "kg", status: "normal" },
  { name: "Chicken", level: 45, unit: "kg", status: "warning" },
  { name: "Rice", level: 60, unit: "kg", status: "normal" },
  { name: "Flour", level: 30, unit: "kg", status: "warning" },
  { name: "Cooking Oil", level: 15, unit: "L", status: "critical" },
]

export default function StockLevels() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Stock Levels
        </CardTitle>
        <CardDescription>Current inventory status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stockItems.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.status === "critical" && <AlertTriangle className="h-4 w-4 ml-2 text-destructive" />}
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.level} {item.unit}
                </span>
              </div>
              <Progress
                value={item.level}
                className={`h-2 ${
                  item.status === "critical"
                    ? "bg-destructive/20"
                    : item.status === "warning"
                      ? "bg-amber-200"
                      : "bg-muted"
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: 10 {item.unit}</span>
                <span>Max: 100 {item.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
              <span>Critical (1)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Warning (2)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Normal (3)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

