const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;

async function fetchAndSaveAsCsv() {
  try {
    console.log("Starting API request...");

    // API request configuration
    const reqOptions = {
      url: "http://localhost:3000/api/recipes?restaurantId=44647e1e-bc77-4dbf-bfc8-8542d37a9027",
      method: "GET",
      // Adding timeout to prevent hanging
      timeout: 5000,
      // Adding error handling for HTTP errors
      validateStatus: (status) => status < 500,
    };

    // Make the request
    console.log(`Fetching from ${reqOptions.url}...`);
    const response = await axios.request(reqOptions);

    // Check status code
    if (response.status !== 200) {
      console.error(`API returned status code ${response.status}`);
      console.error("Response data:", response.data);
      return;
    }

    const data = response.data;
    console.log(
      `Received data with ${
        data ? (Array.isArray(data) ? data.length : "non-array") : "empty"
      } response`
    );

    // Ensure data is array
    if (!Array.isArray(data)) {
      console.error("Response data is not an array. Cannot convert to CSV.");
      console.error("Actual data:", typeof data, data);
      return;
    }

    // Check if array is empty
    if (data.length === 0) {
      console.error("API returned empty array. No data to convert to CSV.");
      return;
    }

    console.log(`Processing ${data.length} recipes...`);

    // Create flattened recipe data for CSV
    const flattenedData = data.map((recipe) => {
      // Verify recipe has expected properties
      if (!recipe || !recipe.id || !recipe.ingredients) {
        console.warn("Recipe with missing properties:", recipe);
        // Return a minimal object to avoid errors
        return {
          recipe_id: recipe?.id || "unknown",
          recipe_name: recipe?.name || "Unknown Recipe",
          description: recipe?.description || "",
          category: recipe?.category || "Uncategorized",
          price: recipe?.price || 0,
          isSpecial: recipe?.isSpecial ? "Yes" : "No",
          ingredients: "",
          estimated_cost: "0.00",
          profit_margin: "0.00",
        };
      }

      // Basic recipe info
      const recipeBase = {
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        description: recipe.description || "",
        category: recipe.category,
        price: recipe.price,
        isSpecial: recipe.isSpecial ? "Yes" : "No",
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      };

      try {
        // Create ingredient list string
        const ingredientsList = recipe.ingredients
          .map((ing) => {
            if (!ing.inventoryItem) {
              console.warn(
                `Missing inventoryItem for ingredient in recipe ${recipe.name}`
              );
              return `${ing.quantity || 0} ${ing.unit || "unit"} Unknown`;
            }
            return `${ing.quantity} ${ing.unit} ${ing.inventoryItem.name}`;
          })
          .join("; ");

        // Add ingredients information
        recipeBase.ingredients = ingredientsList;

        // Calculate total cost based on ingredients
        const totalCost = recipe.ingredients.reduce((sum, ing) => {
          if (!ing.inventoryItem) return sum;

          const itemCost = ing.inventoryItem.cost || 0;
          const itemQuantity = ing.inventoryItem.quantity || 1;
          const usedQuantity = ing.quantity || 0;

          // Prevent division by zero
          if (itemQuantity <= 0) return sum;

          // Calculate proportional cost
          const ingredientCost = (usedQuantity / itemQuantity) * itemCost;
          return sum + ingredientCost;
        }, 0);

        recipeBase.estimated_cost = totalCost.toFixed(2);
        recipeBase.profit_margin = (recipe.price - totalCost).toFixed(2);
      } catch (err) {
        console.error(`Error processing recipe ${recipe.name}:`, err.message);
        recipeBase.ingredients = "Error processing ingredients";
        recipeBase.estimated_cost = "0.00";
        recipeBase.profit_margin = "0.00";
      }

      return recipeBase;
    });

    // Extract headers from first flattened object
    if (flattenedData.length === 0) {
      console.error("No valid recipes to process after filtering");
      return;
    }

    const headers = Object.keys(flattenedData[0]);
    console.log("CSV headers:", headers);

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
      if (!recipe.ingredients) return;

      recipe.ingredients.forEach((ing) => {
        if (!ing.inventoryItem) return;

        try {
          const row = [
            `"${recipe.id}"`,
            `"${(recipe.name || "").replace(/"/g, '""')}"`,
            `"${ing.inventoryItem.id}"`,
            `"${(ing.inventoryItem.name || "").replace(/"/g, '""')}"`,
            `"${ing.inventoryItem.category || ""}"`,
            ing.quantity || 0,
            `"${ing.unit || ""}"`,
            ing.inventoryItem.cost || 0,
          ].join(",");

          ingredientsCsvContent += row + "\n";
        } catch (err) {
          console.error(
            `Error processing ingredient for recipe ${recipe.name}:`,
            err.message
          );
        }
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
    if (error.code === "ECONNREFUSED") {
      console.error(
        "Connection refused. Make sure your API server is running at http://localhost:3000"
      );
    } else if (error.code === "ETIMEDOUT") {
      console.error("Request timed out. API server not responding.");
    } else if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server");
    }
  }
}

// Run the function
fetchAndSaveAsCsv();
