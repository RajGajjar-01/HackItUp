"use client";

import { useEffect, useState } from "react";
import { rest_id } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Clock,
  ChefHat,
  TrendingUp,
  BarChart2,
  PercentIcon,
  Share2,
} from "lucide-react";

export default function Menu() {
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/recipes?restaurantId=${rest_id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setSuggestions(data.suggestions || []);
        setMessage(data.message || "");
        setError(null);
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get color based on days until expiry
  const getExpiryColor = (days) => {
    if (days <= 2) return "text-red-600 bg-red-100";
    if (days <= 4) return "text-amber-600 bg-amber-100";
    return "text-yellow-600 bg-yellow-100";
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please check your connection and try again.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>No Expiring Ingredients</CardTitle>
            <CardDescription>
              Good news! You don't have any ingredients expiring soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All your inventory items are fresh and within their shelf life.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Recipe Suggestions</h1>
        <p className="text-muted-foreground">
          {message || "Optimize your menu based on expiring ingredients"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {suggestions.map((item, index) => {
          const ingredient = item.expiringIngredient;
          const recipeSuggestions = item.suggestedRecipes || [];
          const expiryClass = getExpiryColor(ingredient.daysUntilExpiry);

          return (
            <Card key={ingredient.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-lg font-bold">
                      {ingredient.name}
                      <Badge className={`ml-2 ${expiryClass}`}>
                        {ingredient.daysUntilExpiry} day
                        {ingredient.daysUntilExpiry !== 1 ? "s" : ""} left
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {ingredient.category} • Expires{" "}
                      {formatDate(ingredient.expiryDate)} •{" "}
                      {ingredient.quantity} {ingredient.unit} available
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="mb-4">
                  <p className="text-sm mb-2 font-medium">
                    {recipeSuggestions.length} recipe
                    {recipeSuggestions.length !== 1 ? "s" : ""} using this
                    ingredient
                  </p>
                  <Progress
                    value={
                      recipeSuggestions.length > 0
                        ? Math.min(
                            100,
                            (recipeSuggestions[0].usagePercentage || 0) * 1
                          )
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <Tabs defaultValue="all">
                  <TabsList className="mb-2">
                    <TabsTrigger value="all" className="text-xs">
                      All Suggestions
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="text-xs">
                      Most Popular
                    </TabsTrigger>
                    <TabsTrigger value="usage" className="text-xs">
                      Highest Usage
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <div className="space-y-3">
                      {recipeSuggestions.map((recipe) => (
                        <RecipeCard key={recipe.recipeId} recipe={recipe} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="popular" className="mt-0">
                    <div className="space-y-3">
                      {[...recipeSuggestions]
                        .sort((a, b) => b.totalSales - a.totalSales)
                        .map((recipe) => (
                          <RecipeCard key={recipe.recipeId} recipe={recipe} />
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="usage" className="mt-0">
                    <div className="space-y-3">
                      {[...recipeSuggestions]
                        .sort((a, b) => b.usagePercentage - a.usagePercentage)
                        .map((recipe) => (
                          <RecipeCard key={recipe.recipeId} recipe={recipe} />
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Recipe card component
function RecipeCard({ recipe }) {
  // Calculate usage percentage visual indicator
  const usagePercent = parseFloat(recipe.usagePercentage) || 0;
  const usageColor =
    usagePercent > 60
      ? "text-green-600"
      : usagePercent > 30
      ? "text-amber-600"
      : "text-red-600";

  return (
    <Card className="border border-muted">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-base">{recipe.recipeName}</h3>
            <p className="text-sm text-muted-foreground">
              {recipe.recipeCategory} • ${recipe.recipePrice.toFixed(2)}
            </p>
          </div>

          <Badge variant="outline" className="font-mono">
            Score: {parseFloat(recipe.score).toFixed(1)}
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center p-1 rounded bg-muted/40">
            <span className="text-muted-foreground mb-1">Needed</span>
            <span className="font-medium">
              {recipe.quantityNeeded} {recipe.unit}
            </span>
          </div>

          <div className="flex flex-col items-center p-1 rounded bg-muted/40">
            <span className="text-muted-foreground mb-1">Sales</span>
            <span className="font-medium flex items-center">
              {recipe.totalSales}
              {recipe.recentSales > 0 && (
                <TrendingUp className="h-3 w-3 ml-1 text-green-600" />
              )}
            </span>
          </div>

          <div className="flex flex-col items-center p-1 rounded bg-muted/40">
            <span className="text-muted-foreground mb-1">Usage</span>
            <span className={`font-medium ${usageColor} flex items-center`}>
              {recipe.usagePercentage}%
              <PercentIcon className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" className="text-xs h-7">
            <ChefHat className="h-3 w-3 mr-1" />
            Add to today's menu
          </Button>
        </div>
      </div>
    </Card>
  );
}
