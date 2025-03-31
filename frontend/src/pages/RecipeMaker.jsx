"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Search, Filter, ChefHat, Clock, Users, Utensils, BookOpen } from "lucide-react"

// Sample inventory data - in a real app, this would come from your API
const inventoryIngredients = [
  { id: 1, name: "Tomatoes", category: "Vegetables", quantity: "5 kg", inStock: true },
  { id: 2, name: "Onions", category: "Vegetables", quantity: "3 kg", inStock: true },
  { id: 3, name: "Garlic", category: "Vegetables", quantity: "500 g", inStock: true },
  { id: 4, name: "Chicken Breast", category: "Meat", quantity: "2 kg", inStock: true },
  { id: 5, name: "Ground Beef", category: "Meat", quantity: "1.5 kg", inStock: true },
  { id: 6, name: "Salmon Fillet", category: "Seafood", quantity: "1 kg", inStock: true },
  { id: 7, name: "Shrimp", category: "Seafood", quantity: "800 g", inStock: true },
  { id: 8, name: "Rice", category: "Grains", quantity: "4 kg", inStock: true },
  { id: 9, name: "Pasta", category: "Grains", quantity: "3 kg", inStock: true },
  { id: 10, name: "Flour", category: "Baking", quantity: "2 kg", inStock: true },
  { id: 11, name: "Sugar", category: "Baking", quantity: "1.5 kg", inStock: true },
  { id: 12, name: "Olive Oil", category: "Oils", quantity: "2 L", inStock: true },
  { id: 13, name: "Butter", category: "Dairy", quantity: "1 kg", inStock: true },
  { id: 14, name: "Cheese", category: "Dairy", quantity: "1.5 kg", inStock: true },
  { id: 15, name: "Eggs", category: "Dairy", quantity: "24 units", inStock: true },
  { id: 16, name: "Bell Peppers", category: "Vegetables", quantity: "1 kg", inStock: true },
  { id: 17, name: "Carrots", category: "Vegetables", quantity: "2 kg", inStock: true },
  { id: 18, name: "Potatoes", category: "Vegetables", quantity: "3 kg", inStock: true },
  { id: 19, name: "Basil", category: "Herbs", quantity: "200 g", inStock: true },
  { id: 20, name: "Oregano", category: "Herbs", quantity: "150 g", inStock: true },
  { id: 21, name: "Thyme", category: "Herbs", quantity: "100 g", inStock: true },
  { id: 22, name: "Lemon", category: "Fruits", quantity: "10 units", inStock: true },
  { id: 23, name: "Lime", category: "Fruits", quantity: "8 units", inStock: true },
  { id: 24, name: "Heavy Cream", category: "Dairy", quantity: "1 L", inStock: true },
  { id: 25, name: "Soy Sauce", category: "Condiments", quantity: "750 ml", inStock: true },
  { id: 26, name: "Honey", category: "Condiments", quantity: "500 ml", inStock: true },
  { id: 27, name: "Dijon Mustard", category: "Condiments", quantity: "300 g", inStock: true },
  { id: 28, name: "Parmesan Cheese", category: "Dairy", quantity: "400 g", inStock: true },
  { id: 29, name: "Mushrooms", category: "Vegetables", quantity: "1 kg", inStock: true },
  { id: 30, name: "Spinach", category: "Vegetables", quantity: "800 g", inStock: true },
]

// Get unique categories
const categories = ["All", ...new Set(inventoryIngredients.map((item) => item.category))].sort()

export default function AIRecipeMaker() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Filter ingredients based on search and category
  const filteredIngredients = inventoryIngredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || ingredient.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Toggle ingredient selection
  const toggleIngredient = (id) => {
    setSelectedIngredients((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Generate a recipe based on selected ingredients
  const generateRecipe = () => {
    setIsGenerating(true)

    // In a real app, this would be an API call to an AI service
    setTimeout(() => {
      const selectedNames = selectedIngredients
        .map((id) => inventoryIngredients.find((ing) => ing.id === id)?.name)
        .filter(Boolean)

      // Simulate AI-generated recipe
      if (selectedNames.includes("Chicken Breast") && selectedNames.includes("Pasta")) {
        setGeneratedRecipe({
          name: "Creamy Garlic Chicken Pasta",
          description: "A delicious pasta dish with tender chicken and a creamy garlic sauce.",
          prepTime: 15,
          cookTime: 25,
          servings: 4,
          difficulty: "Medium",
          ingredients: [
            { name: "Chicken Breast", amount: "500g, cut into strips" },
            { name: "Pasta", amount: "400g" },
            { name: "Garlic", amount: "4 cloves, minced" },
            { name: "Heavy Cream", amount: "250ml" },
            { name: "Parmesan Cheese", amount: "100g, grated" },
            { name: "Olive Oil", amount: "2 tbsp" },
            { name: "Butter", amount: "2 tbsp" },
            { name: "Salt", amount: "to taste" },
            { name: "Black Pepper", amount: "to taste" },
            { name: "Basil", amount: "handful, chopped (for garnish)" },
          ],
          instructions: [
            "Bring a large pot of salted water to a boil. Add pasta and cook according to package instructions until al dente. Drain and set aside.",
            "Meanwhile, season chicken strips with salt and pepper.",
            "Heat olive oil in a large skillet over medium-high heat. Add chicken and cook until golden and cooked through, about 6-8 minutes. Remove from pan and set aside.",
            "In the same skillet, add butter and minced garlic. Sauté for 1 minute until fragrant.",
            "Reduce heat to medium-low and add heavy cream. Bring to a simmer and cook for 3-4 minutes until slightly thickened.",
            "Stir in grated Parmesan cheese until melted and smooth.",
            "Return chicken to the skillet and add the cooked pasta. Toss everything together until well coated in the sauce.",
            "Adjust seasoning with salt and pepper if needed.",
            "Serve hot, garnished with fresh chopped basil and additional Parmesan cheese if desired.",
          ],
        })
      } else if (selectedNames.includes("Salmon Fillet")) {
        setGeneratedRecipe({
          name: "Herb-Crusted Salmon with Lemon Butter Sauce",
          description: "Perfectly cooked salmon with a crispy herb crust and tangy lemon butter sauce.",
          prepTime: 10,
          cookTime: 20,
          servings: 2,
          difficulty: "Easy",
          ingredients: [
            { name: "Salmon Fillet", amount: "2 pieces (about 200g each)" },
            { name: "Dijon Mustard", amount: "2 tbsp" },
            { name: "Herbs (Basil, Thyme, Oregano)", amount: "2 tbsp, mixed and chopped" },
            { name: "Breadcrumbs", amount: "1/4 cup" },
            { name: "Butter", amount: "4 tbsp" },
            { name: "Lemon", amount: "1, juiced and zested" },
            { name: "Garlic", amount: "2 cloves, minced" },
            { name: "Olive Oil", amount: "1 tbsp" },
            { name: "Salt", amount: "to taste" },
            { name: "Black Pepper", amount: "to taste" },
          ],
          instructions: [
            "Preheat oven to 200°C (400°F).",
            "Pat salmon fillets dry with paper towels and season with salt and pepper.",
            "In a small bowl, mix together the chopped herbs and breadcrumbs.",
            "Brush the top of each salmon fillet with Dijon mustard, then press the herb-breadcrumb mixture on top.",
            "Heat olive oil in an oven-safe skillet over medium-high heat. Place salmon fillets herb-side up and cook for 2 minutes.",
            "Transfer the skillet to the preheated oven and bake for 12-15 minutes until salmon is cooked through but still moist.",
            "Meanwhile, prepare the sauce: In a small saucepan, melt butter over medium heat. Add minced garlic and cook for 30 seconds until fragrant.",
            "Add lemon juice and zest, and cook for another minute. Season with salt and pepper.",
            "Remove salmon from the oven and plate. Drizzle with the lemon butter sauce.",
            "Serve immediately with your choice of sides.",
          ],
        })
      } else {
        setGeneratedRecipe({
          name: "Vegetable Stir Fry with Rice",
          description: "A quick and healthy vegetable stir fry served over steamed rice.",
          prepTime: 15,
          cookTime: 15,
          servings: 4,
          difficulty: "Easy",
          ingredients: [
            { name: "Rice", amount: "2 cups" },
            { name: "Bell Peppers", amount: "2, sliced" },
            { name: "Carrots", amount: "2, julienned" },
            { name: "Onions", amount: "1, sliced" },
            { name: "Garlic", amount: "3 cloves, minced" },
            { name: "Soy Sauce", amount: "3 tbsp" },
            { name: "Honey", amount: "1 tbsp" },
            { name: "Olive Oil", amount: "2 tbsp" },
            { name: "Salt", amount: "to taste" },
            { name: "Black Pepper", amount: "to taste" },
          ],
          instructions: [
            "Cook rice according to package instructions. Set aside and keep warm.",
            "Heat olive oil in a large wok or skillet over high heat.",
            "Add onions and stir-fry for 1 minute until they begin to soften.",
            "Add garlic and stir-fry for 30 seconds until fragrant.",
            "Add carrots and stir-fry for 2 minutes.",
            "Add bell peppers and continue to stir-fry for another 2-3 minutes until vegetables are crisp-tender.",
            "In a small bowl, mix together soy sauce and honey.",
            "Pour the sauce over the vegetables and toss to coat evenly. Cook for another minute.",
            "Season with salt and pepper to taste.",
            "Serve the stir-fried vegetables over the cooked rice.",
          ],
        })
      }

      setIsGenerating(false)
    }, 2000)
  }

  // Clear selections and generated recipe
  const resetSelections = () => {
    setSelectedIngredients([])
    setGeneratedRecipe(null)
    setSearchQuery("")
    setActiveCategory("All")
  }

  return (
    <div className="container mx-auto p-4 space-y-4 font-poppins">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-4xl font-bold">AI Recipe Maker</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingredients Selection Panel */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5" />
              Inventory Ingredients
            </CardTitle>
            <CardDescription>Select ingredients to include in your recipe</CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search ingredients..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
              <TabsList className="mb-4 flex flex-wrap h-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-grow">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="h-[400px] overflow-y-auto pr-2">
                {filteredIngredients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Search className="h-8 w-8 mb-2" />
                    <p>No ingredients found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredIngredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <Checkbox
                            id={`ingredient-${ingredient.id}`}
                            checked={selectedIngredients.includes(ingredient.id)}
                            onCheckedChange={() => toggleIngredient(ingredient.id)}
                          />
                          <label
                            htmlFor={`ingredient-${ingredient.id}`}
                            className="ml-3 text-sm font-medium cursor-pointer flex-1"
                          >
                            {ingredient.name}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {ingredient.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{ingredient.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">{selectedIngredients.length} ingredients selected</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetSelections}>
                Reset
              </Button>
              <Button
                onClick={generateRecipe}
                disabled={selectedIngredients.length === 0 || isGenerating}
                className="flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Recipe
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Recipe Display Panel */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="mr-2 h-5 w-5" />
              {generatedRecipe ? "Generated Recipe" : "Recipe Preview"}
            </CardTitle>
            <CardDescription>
              {generatedRecipe
                ? "Your AI-generated recipe based on selected ingredients"
                : "Select ingredients and click Generate to create a recipe"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedRecipe ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Recipe Generated Yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Select ingredients from your inventory on the left panel and click the "Generate Recipe" button to
                  create a custom recipe.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{generatedRecipe.name}</h2>
                  <p className="text-muted-foreground">{generatedRecipe.description}</p>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Prep: {generatedRecipe.prepTime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Cook: {generatedRecipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Serves: {generatedRecipe.servings}</span>
                    </div>
                    <Badge variant="outline">{generatedRecipe.difficulty}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ingredients</h3>
                  <ul className="space-y-2">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                        <span className="font-medium">{ingredient.name}:</span>
                        <span className="ml-2">{ingredient.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Instructions</h3>
                  <ol className="space-y-3">
                    {generatedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        <p className="text-sm">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </CardContent>
          {generatedRecipe && (
            <CardFooter className="flex justify-end border-t pt-4">
              <div className="flex space-x-2">
                <Button variant="outline">Save Recipe</Button>
                <Button>Add to Menu</Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

