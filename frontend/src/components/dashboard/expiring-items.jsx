"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ExpiringItems() {
  const [expiringData, setExpiringData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExpiringItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/suggestions/expiring-recipes?restaurantId=1814d447-13f8-4b35-b504-b7f2c998be4a')
        if (!response.ok) throw new Error('Failed to fetch expiring items')
        const data = await response.json()
        setExpiringData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExpiringItems()
  }, [])

  const getStatus = (daysUntilExpiry) => {
    if (daysUntilExpiry <= 3) return 'critical'
    if (daysUntilExpiry <= 7) return 'warning'
    return 'normal'
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Expiring Items
          </CardTitle>
          <CardDescription>Loading expiring items...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Expiring Items
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-destructive p-4">
          <p>Error loading data:</p>
          <p className="text-sm mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const statusCounts = expiringData.suggestions.reduce((acc, item) => {
    const status = getStatus(item.expiringIngredient.daysUntilExpiry)
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, { critical: 0, warning: 0, normal: 0 })

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Expiring Items
        </CardTitle>
        <CardDescription>{expiringData.message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringData.suggestions.map((item, index) => {
            const status = getStatus(item.expiringIngredient.daysUntilExpiry)
            const expiryDate = new Date(item.expiringIngredient.expiryDate)
            
            return (
              <div key={index} className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">
                        {item.expiringIngredient.name}
                      </span>
                      {status === 'critical' && <AlertTriangle className="h-4 w-4 ml-2 text-destructive" />}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.expiringIngredient.quantity} {item.expiringIngredient.unit}
                    </span>
                  </div>
                  <Progress
                    value={100 - (item.expiringIngredient.daysUntilExpiry * 10)}
                    className={`h-2 ${
                      status === 'critical'
                        ? 'bg-destructive/20'
                        : status === 'warning'
                        ? 'bg-amber-200'
                        : 'bg-muted'
                    }`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Expires: {expiryDate.toLocaleDateString()}</span>
                    <span>{item.expiringIngredient.daysUntilExpiry} days remaining</span>
                  </div>
                </div>

                <div className="ml-4 space-y-2">
                  {item.suggestedRecipes.map((recipe, recipeIndex) => (
                    <div key={recipeIndex} className="text-xs p-2 bg-muted/50 rounded">
                      <div className="font-medium">{recipe.recipeName}</div>
                      <div className="text-muted-foreground">
                        Use {recipe.quantityNeeded} {recipe.unit} ({recipe.usagePercentage}% of total)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
              <span>Critical ({statusCounts.critical})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Warning ({statusCounts.warning})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Normal ({statusCounts.normal})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}