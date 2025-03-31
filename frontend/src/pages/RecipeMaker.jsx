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

    // Fruits
    { id: 22, name: "Lemon", category: "Fruits", quantity: "10 units", inStock: true },
    { id: 23, name: "Lime", category: "Fruits", quantity: "8 units", inStock: true },

    // Vegetables that can be juiced or used in salads
    { id: 1, name: "Tomatoes", category: "Vegetables", quantity: "5 kg", inStock: true },
    { id: 2, name: "Onions", category: "Vegetables", quantity: "3 kg", inStock: true },
    { id: 16, name: "Bell Peppers", category: "Vegetables", quantity: "1 kg", inStock: true },
    { id: 17, name: "Carrots", category: "Vegetables", quantity: "2 kg", inStock: true },
    { id: 29, name: "Mushrooms", category: "Vegetables", quantity: "1 kg", inStock: true },
    { id: 30, name: "Spinach", category: "Vegetables", quantity: "800 g", inStock: true },

    // Herbs for flavor enhancement
    { id: 19, name: "Basil", category: "Herbs", quantity: "200 g", inStock: true },
    { id: 20, name: "Oregano", category: "Herbs", quantity: "150 g", inStock: true },

    // Complementary ingredients
    { id: 12, name: "Olive Oil", category: "Oils", quantity: "2 L", inStock: true },
    { id: 25, name: "Soy Sauce", category: "Condiments", quantity: "750 ml", inStock: true },
    { id: 26, name: "Honey", category: "Condiments", quantity: "500 ml", inStock: true },

    // Dairy that might be used in dressings
    { id: 24, name: "Heavy Cream", category: "Dairy", quantity: "1 L", inStock: true },
    { id: 28, name: "Parmesan Cheese", category: "Dairy", quantity: "400 g", inStock: true },

    { id: 31, name: "Apples", category: "Fruits", quantity: "0 kg", inStock: false },
    { id: 32, name: "Oranges", category: "Fruits", quantity: "0 kg", inStock: false },
    { id: 33, name: "Watermelons", category: "Fruits", quantity: "0 kg", inStock: false },
    { id: 34, name: "Strawberries", category: "Fruits", quantity: "0 kg", inStock: false },
    { id: 35, name: "Pineapples", category: "Fruits", quantity: "0 kg", inStock: false },
    { id: 36, name: "Grapes", category: "Fruits", quantity: "0 kg", inStock: false },
    { id: 37, name: "Bananas", category: "Fruits", quantity: "0 kg", inStock: false },
    { id: 38, name: "Mangoes", category: "Fruits", quantity: "0 kg", inStock: false }

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
            if (selectedNames.includes("Spinach") || (selectedNames.includes("Lemon") || selectedNames.includes("Lime"))) {
                setGeneratedRecipe({
                    name: "Zesty Citrus Spinach Salad",
                    description: "Fresh spinach with bright citrus dressing and crunchy veggies",
                    prepTime: 15,
                    cookTime: 0,
                    servings: 2,
                    ingredients: [
                        { name: "Spinach", amount: "200g" },
                        { name: selectedNames.includes("Lemon") ? "Lemon" : "Lime", amount: "2, juiced" },
                        { name: "Bell Peppers", amount: "1, sliced" },
                        { name: "Carrots", amount: "1, shredded" },
                        { name: "Olive Oil", amount: "3 tbsp" },
                        { name: "Honey", amount: "1 tsp" }
                    ],
                    instructions: [
                        "Whisk citrus juice, olive oil and honey for dressing",
                        "Toss spinach with dressing",
                        "Top with sliced peppers and shredded carrots",
                        "Add extra citrus zest for brightness"
                    ]
                })
            }
            else if (selectedNames.includes("Pasta") || selectedNames.includes("Mushrooms") || selectedNames.includes("Spinach")) {
                setGeneratedRecipe({
                    name: "Creamy Mushroom Spinach Pasta",
                    description: "Vegetarian pasta with earthy mushrooms and fresh spinach",
                    prepTime: 10,
                    cookTime: 20,
                    ingredients: [
                        { name: "Pasta", amount: "300g" },
                        { name: "Mushrooms", amount: "250g, sliced" },
                        { name: "Spinach", amount: "150g" },
                        { name: "Garlic", amount: "3 cloves" },
                        { name: "Heavy Cream", amount: "200ml" },
                        { name: "Parmesan Cheese", amount: "50g" }
                    ],
                    instructions: [
                        "Cook pasta al dente, reserve 1 cup pasta water",
                        "Sauté mushrooms and garlic in olive oil",
                        "Add spinach until wilted",
                        "Stir in cream and parmesan to create sauce",
                        "Toss with pasta, adding pasta water as needed"
                    ]
                })
            }
            else if (selectedNames.includes("Tomatoes") || selectedNames.includes("Basil")) {
                setGeneratedRecipe({
                    name: "Herbed Tomato Bruschetta",
                    description: "Classic Italian appetizer with fresh tomatoes",
                    prepTime: 20,
                    cookTime: 5,
                    ingredients: [
                        { name: "Tomatoes", amount: "3, diced" },
                        { name: "Basil", amount: "1/4 cup" },
                        { name: "Olive Oil", amount: "2 tbsp" },
                        { name: "Bread", amount: "1 baguette" }
                    ],
                    instructions: [
                        "Toast bread slices",
                        "Mix tomatoes with basil and olive oil",
                        "Season with salt",
                        "Spoon mixture onto toasted bread"
                    ]
                })
            }
            else if (selectedNames.includes("Carrots") || (selectedNames.includes("Ginger") || selectedNames.includes("Lemon"))) {
                setGeneratedRecipe({
                    name: "Carrot Ginger Immunity Booster",
                    description: "Vitamin-packed juice with spicy ginger kick",
                    prepTime: 10,
                    cookTime: 0,
                    ingredients: [
                        { name: "Carrots", amount: "4 large" },
                        { name: selectedNames.includes("Ginger") ? "Ginger" : "Lemon", amount: "1 inch knob or 1/2 lemon" },
                        { name: "Honey", amount: "1 tsp (optional)" }
                    ],
                    instructions: [
                        "Juice carrots first",
                        "Add ginger/lemon",
                        "Stir in honey if desired",
                        "Serve immediately"
                    ]
                })
            }
            else {
                return null;
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
                <h1 className="text-6xl font-semibold font-mona-sans tracking-tighter">AI Recipe Maker</h1>
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

