"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Maximize2 } from "lucide-react"

export default function CameraFeed() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate camera feed loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Real-Time Camera Feed
          </CardTitle>
          <CardDescription>AI-powered inventory monitoring</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Camera feed placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">LIVE</div>
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                Kitchen Area
              </div>
            </>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm font-medium">Items Detected</div>
            <div className="text-2xl font-bold">24</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm font-medium">Low Stock Items</div>
            <div className="text-2xl font-bold text-amber-500">6</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

