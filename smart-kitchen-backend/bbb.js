const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;

async function fetchAndSaveAsCsv() {
  try {
    // API request configuration
    const reqOptions = {
      url: "http://localhost:3000/api/recipes?restaurantId=09bd8dba-086b-4cc0-a940-0018df422e21",
      method: "GET",
    };

    // Make the request
    const response = await axios.request(reqOptions);
    const data = response.data;

    // Ensure data is array
    if (!Array.isArray(data)) {
      console.error("Response data is not an array. Cannot convert to CSV.");
      return;
    }

    // Create flattened recipe data for CSV
    const flattenedData = data.map((recipe) => {
      // Basic recipe info
      const recipeBase = {
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        price: recipe.price,
        isSpecial: recipe.isSpecial ? "Yes" : "No",
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      };

      // Create ingredient list string
      const ingredientsList = recipe.ingredients
        .map((ing) => `${ing.quantity} ${ing.unit} ${ing.inventoryItem.name}`)
        .join("; ");

      // Add ingredients information
      recipeBase.ingredients = ingredientsList;

      // Calculate total cost based on ingredients
      const totalCost = recipe.ingredients.reduce((sum, ing) => {
        const itemCost = ing.inventoryItem.cost;
        const itemQuantity = ing.inventoryItem.quantity;
        const usedQuantity = ing.quantity;

        // Calculate proportional cost
        const ingredientCost = (usedQuantity / itemQuantity) * itemCost;
        return sum + ingredientCost;
      }, 0);

      recipeBase.estimated_cost = totalCost.toFixed(2);
      recipeBase.profit_margin = (recipe.price - totalCost).toFixed(2);

      return recipeBase;
    });

    // Extract headers from first flattened object
    const headers = Object.keys(flattenedData[0]);

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    flattenedData.forEach((item) => {
      const row = headers.map((header) => {
        // Handle values that need escaping (commas, quotes, etc.)
        const value = item[header]?.toString() || "";
        if (
          value.includes(",") ||
          value.includes('"') ||
          value.includes("\n")
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += row.join(",") + "\n";
    });

    // Save main recipes CSV
    const recipeFilePath = path.join(process.cwd(), "recipes.csv");
    await fs.writeFile(recipeFilePath, csvContent);
    console.log(`Recipe CSV file saved to ${recipeFilePath}`);

    // Create a separate detailed ingredients CSV
    let ingredientsCsvContent =
      "recipe_id,recipe_name,ingredient_id,ingredient_name,category,quantity,unit,cost\n";

    data.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const row = [
          `"${recipe.id}"`,
          `"${recipe.name.replace(/"/g, '""')}"`,
          `"${ing.inventoryItem.id}"`,
          `"${ing.inventoryItem.name.replace(/"/g, '""')}"`,
          `"${ing.inventoryItem.category}"`,
          ing.quantity,
          `"${ing.unit}"`,
          ing.inventoryItem.cost,
        ].join(",");

        ingredientsCsvContent += row + "\n";
      });
    });

    // Save ingredients CSV
    const ingredientsFilePath = path.join(
      process.cwd(),
      "recipe_ingredients.csv"
    );
    await fs.writeFile(ingredientsFilePath, ingredientsCsvContent);
    console.log(`Ingredients CSV file saved to ${ingredientsFilePath}`);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the function
fetchAndSaveAsCsv();
