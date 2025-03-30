const prisma = require("../lib/prisma");

/**
 * Get all recipes for a restaurant
 */
const getAllRecipes = async (req, res) => {
  try {
    // const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const recipes = await prisma.recipe.findMany({
      where: { restaurantId },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Get recipes error:", error);
    res.status(500).json({ message: "Server error while fetching recipes" });
  }
};

/**
 * Get a single recipe by ID
 */
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;

    const recipe = await prisma.recipe.findFirst({
      where: {
        id,
        restaurantId,
      },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(500).json({ message: "Server error while fetching recipe" });
  }
};

/**
 * Create a new recipe
 */
const createRecipe = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      imageUrl,
      ingredients,
      isSpecial,
    } = req.body;

    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    if (!name || !category || !price || !ingredients || !ingredients.length) {
      return res.status(400).json({
        message:
          "Name, category, price, and at least one ingredient are required",
      });
    }

    // Verify all ingredients exist and belong to the restaurant
    const ingredientIds = ingredients.map((ing) => ing.inventoryItemId);

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        id: { in: ingredientIds },
        restaurantId,
      },
    });

    if (inventoryItems.length !== ingredientIds.length) {
      return res.status(400).json({
        message:
          "One or more ingredients do not exist or do not belong to this restaurant",
      });
    }

    // Create recipe with ingredients
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        category,
        price: parseFloat(price),
        imageUrl,
        isSpecial: isSpecial || false,
        restaurant: {
          connect: { id: restaurantId },
        },
        ingredients: {
          create: ingredients.map((ing) => ({
            quantity: parseFloat(ing.quantity),
            unit: ing.unit,
            inventoryItem: {
              connect: { id: ing.inventoryItemId },
            },
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Server error while creating recipe" });
  }
};

/**
 * Update an existing recipe
 */
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;
    const {
      name,
      description,
      category,
      price,
      imageUrl,
      ingredients,
      isSpecial,
    } = req.body;

    // Check if recipe exists and belongs to the restaurant
    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        id,
        restaurantId,
      },
      include: {
        ingredients: true,
      },
    });

    if (!existingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Start transaction to update recipe and ingredients
    const recipe = await prisma.$transaction(async (prisma) => {
      // If ingredients are provided, delete old ones and create new ones
      if (ingredients && ingredients.length > 0) {
        // Verify all ingredients exist and belong to the restaurant
        const ingredientIds = ingredients.map((ing) => ing.inventoryItemId);

        const inventoryItems = await prisma.inventoryItem.findMany({
          where: {
            id: { in: ingredientIds },
            restaurantId,
          },
        });

        if (inventoryItems.length !== ingredientIds.length) {
          throw new Error(
            "One or more ingredients do not exist or do not belong to this restaurant"
          );
        }

        // Delete old ingredients
        await prisma.recipeItem.deleteMany({
          where: { recipeId: id },
        });

        // Create new ingredients
        for (const ing of ingredients) {
          await prisma.recipeItem.create({
            data: {
              recipeId: id,
              inventoryItemId: ing.inventoryItemId,
              quantity: parseFloat(ing.quantity),
              unit: ing.unit,
            },
          });
        }
      }

      // Update recipe
      const updatedRecipe = await prisma.recipe.update({
        where: { id },
        data: {
          name: name !== undefined ? name : existingRecipe.name,
          description:
            description !== undefined
              ? description
              : existingRecipe.description,
          category: category !== undefined ? category : existingRecipe.category,
          price: price !== undefined ? parseFloat(price) : existingRecipe.price,
          imageUrl: imageUrl !== undefined ? imageUrl : existingRecipe.imageUrl,
          isSpecial:
            isSpecial !== undefined ? isSpecial : existingRecipe.isSpecial,
        },
        include: {
          ingredients: {
            include: {
              inventoryItem: true,
            },
          },
        },
      });

      return updatedRecipe;
    });

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Update recipe error:", error);
    if (
      error.message ===
      "One or more ingredients do not exist or do not belong to this restaurant"
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error while updating recipe" });
  }
};

/**
 * Delete a recipe
 */
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;

    // Check if recipe exists and belongs to the restaurant
    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        id,
        restaurantId,
      },
    });

    if (!existingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Start transaction to delete recipe and related records
    await prisma.$transaction(async (prisma) => {
      // Delete recipe ingredients
      await prisma.recipeItem.deleteMany({
        where: { recipeId: id },
      });

      // Delete sales data
      await prisma.salesData.deleteMany({
        where: { recipeId: id },
      });

      // Delete recipe
      await prisma.recipe.delete({
        where: { id },
      });
    });

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ message: "Server error while deleting recipe" });
  }
};

/**
 * Get recipes with all ingredients in stock
 */
const getAvailableRecipes = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    // Get all recipes with their ingredients
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    // Filter recipes that have all ingredients in sufficient stock
    const availableRecipes = recipes.filter((recipe) => {
      return recipe.ingredients.every((ingredient) => {
        return ingredient.inventoryItem.quantity >= ingredient.quantity;
      });
    });

    res.status(200).json(availableRecipes);
  } catch (error) {
    console.error("Get available recipes error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching available recipes" });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAvailableRecipes,
};
