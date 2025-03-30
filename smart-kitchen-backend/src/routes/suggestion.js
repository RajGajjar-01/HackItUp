// routes/suggestions.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/suggestions/expiring-recipes
 * Returns recipe suggestions for ingredients that will expire soon
 * Can be filtered by days until expiry
 */
router.get("/expiring-recipes", async (req, res) => {
  try {
    const daysThreshold = parseInt(req.query.days) || 7; // Default to 7 days
    const restaurantId = req.query.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    // Find inventory items that will expire within the threshold
    const expiringItems = await prisma.inventoryItem.findMany({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          lte: thresholdDate,
          gt: today,
        },
        quantity: {
          gt: 0, // Only items that are still in stock
        },
      },
      include: {
        usedInRecipes: {
          include: {
            recipe: {
              include: {
                salesData: true,
              },
            },
          },
        },
        restaurant: true,
      },
    });

    if (expiringItems.length === 0) {
      return res.json({
        message: "No ingredients are expiring soon.",
        suggestions: [],
      });
    }

    // Process each expiring item to find recipes that use it
    const suggestions = [];

    for (const item of expiringItems) {
      // Get all recipes using this ingredient
      const recipesUsingItem = item.usedInRecipes.map((recipeItem) => ({
        recipe: recipeItem.recipe,
        quantityNeeded: recipeItem.quantity,
        unit: recipeItem.unit,
      }));

      if (recipesUsingItem.length === 0) continue;

      // Calculate priority score for each recipe
      const scoredRecipes = recipesUsingItem.map(
        ({ recipe, quantityNeeded, unit }) => {
          // Calculate days until expiry
          const daysUntilExpiry = item.expiryDate
            ? Math.ceil((item.expiryDate - today) / (1000 * 60 * 60 * 24))
            : daysThreshold;

          // Calculate usage percentage (how much of the expiring item this recipe would use)
          const usagePercentage = (quantityNeeded / item.quantity) * 100;

          // Calculate historical popularity based on sales data
          let totalSold = 0;
          let recentSales = 0;
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);

          recipe.salesData.forEach((sale) => {
            totalSold += sale.quantitySold;
            if (sale.date >= thirtyDaysAgo) {
              recentSales += sale.quantitySold;
            }
          });

          // Calculate final priority score
          // Lower days until expiry = higher urgency
          // Higher usage percentage = better use of expiring ingredient
          // Higher recent sales = more popular with customers
          const urgencyScore =
            ((daysThreshold - daysUntilExpiry) / daysThreshold) * 10; // 0-10 (10 = most urgent)
          const usageScore = Math.min(usagePercentage / 20, 10); // 0-10 (10 = uses 100% or more)
          const popularityScore = Math.min(recentSales / 10, 10); // 0-10 (10 = sold 100+ in last month)

          const totalScore =
            urgencyScore * 0.5 + usageScore * 0.3 + popularityScore * 0.2;

          return {
            recipeId: recipe.id,
            recipeName: recipe.name,
            recipeCategory: recipe.category,
            recipePrice: recipe.price,
            recipeImageUrl: recipe.imageUrl,
            ingredientName: item.name,
            ingredientQuantity: item.quantity,
            ingredientExpiryDate: item.expiryDate,
            daysUntilExpiry,
            quantityNeeded,
            unit,
            totalSales: totalSold,
            recentSales,
            usagePercentage: Math.min(usagePercentage, 100).toFixed(2),
            score: totalScore.toFixed(2),
          };
        }
      );

      // Sort recipes by score (descending)
      scoredRecipes.sort((a, b) => b.score - a.score);

      suggestions.push({
        expiringIngredient: {
          id: item.id,
          name: item.name,
          category: item.category,
          expiryDate: item.expiryDate,
          daysUntilExpiry: Math.ceil(
            (item.expiryDate - today) / (1000 * 60 * 60 * 24)
          ),
          quantity: item.quantity,
          unit: item.unit,
        },
        suggestedRecipes: scoredRecipes,
      });
    }

    // Sort suggestions by urgency (days until expiry)
    suggestions.sort(
      (a, b) =>
        a.expiringIngredient.daysUntilExpiry -
        b.expiringIngredient.daysUntilExpiry
    );

    return res.json({
      message: `Found ${suggestions.length} ingredients expiring within ${daysThreshold} days`,
      suggestions,
    });
  } catch (error) {
    console.error("Error suggesting recipes:", error);
    return res.status(500).json({
      error: "Failed to get recipe suggestions",
      details: error.message,
    });
  }
});

/**
 * GET /api/suggestions/recipe-inventory-check/:recipeId
 * Checks if all ingredients for a recipe are available
 */
router.get("/recipe-inventory-check/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const ingredientStatus = recipe.ingredients.map((ingredient) => {
      const available =
        ingredient.inventoryItem.quantity >= ingredient.quantity;
      const percentAvailable =
        (ingredient.inventoryItem.quantity / ingredient.quantity) * 100;

      return {
        ingredientId: ingredient.inventoryItemId,
        ingredientName: ingredient.inventoryItem.name,
        required: ingredient.quantity,
        available: ingredient.inventoryItem.quantity,
        unit: ingredient.unit,
        isAvailable: available,
        percentAvailable:
          percentAvailable > 100 ? 100 : percentAvailable.toFixed(2),
      };
    });

    const allAvailable = ingredientStatus.every((status) => status.isAvailable);

    return res.json({
      recipeId: recipe.id,
      recipeName: recipe.name,
      allIngredientsAvailable: allAvailable,
      ingredientStatus,
    });
  } catch (error) {
    console.error("Error checking recipe inventory:", error);
    return res.status(500).json({
      error: "Failed to check recipe inventory",
      details: error.message,
    });
  }
});

/**
 * GET /api/suggestions/expiring-dashboard/:restaurantId
 * Get comprehensive expiration dashboard data for a restaurant
 */
router.get("/expiring-dashboard/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const today = new Date();

    // Get counts of items expiring in different time ranges
    const expiringToday = await prisma.inventoryItem.count({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          gte: today,
          lt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
          ),
        },
        quantity: { gt: 0 },
      },
    });

    const expiringThisWeek = await prisma.inventoryItem.count({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          gte: today,
          lt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 7
          ),
        },
        quantity: { gt: 0 },
      },
    });

    const expiringThisMonth = await prisma.inventoryItem.count({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          gte: today,
          lt: new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
          ),
        },
        quantity: { gt: 0 },
      },
    });

    // Get items expiring within 7 days with details
    const expiringItems = await prisma.inventoryItem.findMany({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          gte: today,
          lt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 7
          ),
        },
        quantity: { gt: 0 },
      },
      orderBy: {
        expiryDate: "asc",
      },
      include: {
        usedInRecipes: {
          include: {
            recipe: true,
          },
        },
      },
    });

    // Calculate total value of expiring inventory
    const totalValue = expiringItems.reduce((sum, item) => {
      return sum + item.quantity * item.cost;
    }, 0);

    return res.json({
      counts: {
        expiringToday,
        expiringThisWeek,
        expiringThisMonth,
      },
      totalValue: totalValue.toFixed(2),
      expiringItems: expiringItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        expiryDate: item.expiryDate,
        daysUntilExpiry: Math.ceil(
          (item.expiryDate - today) / (1000 * 60 * 60 * 24)
        ),
        value: (item.quantity * item.cost).toFixed(2),
        recipesCount: item.usedInRecipes.length,
        recipes: item.usedInRecipes.map((recipeItem) => ({
          id: recipeItem.recipe.id,
          name: recipeItem.recipe.name,
          quantityNeeded: recipeItem.quantity,
          unit: recipeItem.unit,
        })),
      })),
    });
  } catch (error) {
    console.error("Error getting expiration dashboard:", error);
    return res.status(500).json({
      error: "Failed to get expiration dashboard",
      details: error.message,
    });
  }
});

/**
 * GET /api/suggestions/specials-recommendations/:restaurantId
 * Recommends recipes to add as specials based on inventory and sales data
 */
router.get("/specials-recommendations/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const today = new Date();
    const week = parseInt(req.query.weeks) || 1; // Number of weeks to look ahead

    // Find items that will expire within the next X weeks
    const expiryThreshold = new Date();
    expiryThreshold.setDate(today.getDate() + week * 7);

    // Get low-turnover ingredients with upcoming expiry dates
    const expiringIngredients = await prisma.inventoryItem.findMany({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          gt: today,
          lte: expiryThreshold,
        },
        quantity: { gt: 0 },
      },
      include: {
        usedInRecipes: {
          include: {
            recipe: {
              include: {
                salesData: {
                  orderBy: {
                    date: "desc",
                  },
                  take: 10,
                },
              },
            },
          },
        },
      },
    });

    // Get recipes that aren't currently specials
    const regularRecipes = await prisma.recipe.findMany({
      where: {
        restaurantId,
        isSpecial: false,
      },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
        salesData: {
          orderBy: {
            date: "desc",
          },
          take: 10,
        },
      },
    });

    // Calculate score for each recipe
    const recipeSuggestions = regularRecipes.map((recipe) => {
      // Check if recipe contains expiring ingredients
      const expiringIngredientCount = recipe.ingredients.filter(
        (ingredient) => {
          const inventoryItem = ingredient.inventoryItem;
          return (
            inventoryItem.expiryDate &&
            inventoryItem.expiryDate > today &&
            inventoryItem.expiryDate <= expiryThreshold
          );
        }
      ).length;

      // Calculate recent popularity (inverse - we want to promote less popular items)
      const totalRecentSales = recipe.salesData.reduce(
        (sum, sale) => sum + sale.quantitySold,
        0
      );
      const popularityScore = Math.max(10 - totalRecentSales, 0); // Higher score for less popular items

      // Calculate profit margin
      const costPrice = recipe.ingredients.reduce((sum, ingredient) => {
        return sum + ingredient.quantity * ingredient.inventoryItem.cost;
      }, 0);
      const profitMargin = ((recipe.price - costPrice) / recipe.price) * 100;
      const marginScore = Math.min(profitMargin / 10, 10); // 0-10 scale

      // Calculate final score
      const expiryScore = expiringIngredientCount * 2; // 2 points per expiring ingredient
      const totalScore =
        expiryScore * 0.5 + popularityScore * 0.3 + marginScore * 0.2;

      return {
        recipeId: recipe.id,
        recipeName: recipe.name,
        recipeCategory: recipe.category,
        expiringIngredientCount,
        recentSales: totalRecentSales,
        profitMargin: profitMargin.toFixed(2) + "%",
        price: recipe.price,
        recommendationScore: totalScore.toFixed(2),
        ingredients: recipe.ingredients.map((ingredient) => ({
          id: ingredient.inventoryItem.id,
          name: ingredient.inventoryItem.name,
          isExpiring:
            ingredient.inventoryItem.expiryDate &&
            ingredient.inventoryItem.expiryDate > today &&
            ingredient.inventoryItem.expiryDate <= expiryThreshold,
          expiryDate: ingredient.inventoryItem.expiryDate,
        })),
      };
    });

    // Sort by recommendation score
    recipeSuggestions.sort(
      (a, b) => b.recommendationScore - a.recommendationScore
    );

    return res.json({
      expiringIngredientCount: expiringIngredients.length,
      recommendedSpecials: recipeSuggestions.slice(0, 5), // Top 5 recommendations
    });
  } catch (error) {
    console.error("Error generating specials recommendations:", error);
    return res.status(500).json({
      error: "Failed to generate specials recommendations",
      details: error.message,
    });
  }
});

/**
 * GET /api/suggestions/minimal-waste-menu/:restaurantId
 * Generates a menu that minimizes potential waste based on current inventory
 */
router.get("/minimal-waste-menu/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuSize = parseInt(req.query.size) || 10; // Default menu size
    const today = new Date();

    // Get all recipes for this restaurant
    const recipes = await prisma.recipe.findMany({
      where: {
        restaurantId,
      },
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
        salesData: true,
      },
    });

    // Get all inventory items close to expiry
    const expiryThreshold = new Date();
    expiryThreshold.setDate(today.getDate() + 7); // 7 days

    const expiringItems = await prisma.inventoryItem.findMany({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          gt: today,
          lte: expiryThreshold,
        },
        quantity: { gt: 0 },
      },
    });

    const expiringItemIds = expiringItems.map((item) => item.id);

    // Calculate a waste reduction score for each recipe
    const scoredRecipes = recipes.map((recipe) => {
      // Count expiring ingredients used
      const expiringIngredientsUsed = recipe.ingredients.filter((ingredient) =>
        expiringItemIds.includes(ingredient.inventoryItemId)
      ).length;

      // Calculate percentage of recipe ingredients that are expiring soon
      const expiringPercentage =
        (expiringIngredientsUsed / recipe.ingredients.length) * 100;

      // Calculate historical popularity
      const totalSales = recipe.salesData.reduce(
        (sum, sale) => sum + sale.quantitySold,
        0
      );

      // Calculate balance score (we want popular recipes that use expiring ingredients)
      const expiryScore = expiringPercentage * 0.1; // 0-10 scale
      const popularityScore = Math.min(totalSales / 10, 10); // 0-10 scale

      const totalScore = expiryScore * 0.7 + popularityScore * 0.3;

      return {
        recipeId: recipe.id,
        recipeName: recipe.name,
        category: recipe.category,
        price: recipe.price,
        expiringIngredientsCount: expiringIngredientsUsed,
        expiringIngredientsPercentage: expiringPercentage.toFixed(2) + "%",
        historicalSales: totalSales,
        wasteReductionScore: totalScore.toFixed(2),
        ingredients: recipe.ingredients.map((ingredient) => ({
          name: ingredient.inventoryItem.name,
          isExpiring: expiringItemIds.includes(ingredient.inventoryItemId),
          expiryDate: ingredient.inventoryItem.expiryDate,
        })),
      };
    });

    // Sort by waste reduction score
    scoredRecipes.sort((a, b) => b.wasteReductionScore - a.wasteReductionScore);

    // Create balanced menu with different categories
    const categories = [
      ...new Set(scoredRecipes.map((recipe) => recipe.category)),
    ];
    const menuSuggestion = {};

    categories.forEach((category) => {
      const categoryRecipes = scoredRecipes
        .filter((recipe) => recipe.category === category)
        .slice(0, Math.ceil(menuSize / categories.length));

      menuSuggestion[category] = categoryRecipes;
    });

    return res.json({
      expiringItemsCount: expiringItems.length,
      menuSuggestion,
      allRecipesScored: scoredRecipes,
    });
  } catch (error) {
    console.error("Error generating minimal waste menu:", error);
    return res.status(500).json({
      error: "Failed to generate minimal waste menu",
      details: error.message,
    });
  }
});

/**
 * GET /api/suggestions/inventory-optimization/:restaurantId
 * Provides recommendations for optimizing inventory based on recipes and sales
 */
router.get("/inventory-optimization/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Get all inventory items
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        restaurantId,
      },
      include: {
        usedInRecipes: {
          include: {
            recipe: {
              include: {
                salesData: {
                  orderBy: {
                    date: "desc",
                  },
                  take: 30,
                },
              },
            },
          },
        },
        wasteRecords: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 90)), // Last 90 days
            },
          },
        },
      },
    });

    const recommendations = inventoryItems.map((item) => {
      // Calculate average usage rate based on sales data
      let totalUsage = 0;
      let recipeCount = 0;

      item.usedInRecipes.forEach((recipeItem) => {
        const recipe = recipeItem.recipe;
        const recentSales = recipe.salesData.reduce(
          (sum, sale) => sum + sale.quantitySold,
          0
        );
        totalUsage += recentSales * recipeItem.quantity;
        recipeCount += 1;
      });

      // Calculate waste percentage
      const totalWasted = item.wasteRecords.reduce(
        (sum, record) => sum + record.quantity,
        0
      );
      const wastePercentage =
        item.quantity > 0
          ? (totalWasted / (item.quantity + totalWasted)) * 100
          : 0;

      // Calculate optimal quantity
      // Based on: Average daily usage × lead time (assumed 7 days) + safety stock
      const averageDailyUsage = totalUsage / 30; // Based on 30 days of sales data
      const leadTime = 7; // Assumed lead time in days
      const safetyStock = averageDailyUsage * 3; // 3 days safety stock
      const optimalQuantity = Math.ceil(
        averageDailyUsage * leadTime + safetyStock
      );

      // Determine status
      let status = "Optimal";
      let action = "No action needed";

      if (item.quantity < item.minQuantity) {
        status = "Critical Low";
        action = "Order immediately";
      } else if (item.quantity < optimalQuantity * 0.5) {
        status = "Low";
        action = "Reorder soon";
      } else if (item.quantity > optimalQuantity * 2) {
        status = "Overstocked";
        action = "Reduce future orders";
      }

      // If waste is high, suggest adjusting
      if (wastePercentage > 15) {
        status = "High Waste";
        action = "Reduce order quantity and review usage";
      }

      return {
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        currentQuantity: item.quantity,
        unit: item.unit,
        minQuantity: item.minQuantity,
        recommendedMinQuantity: Math.ceil(optimalQuantity * 0.5),
        optimalQuantity,
        usedInRecipes: recipeCount,
        averageDailyUsage: averageDailyUsage.toFixed(2),
        wastePercentage: wastePercentage.toFixed(2) + "%",
        status,
        action,
        costImpact: ((item.quantity - optimalQuantity) * item.cost).toFixed(2), // Positive = excess inventory cost
      };
    });

    // Sort by status priority
    const statusPriority = {
      "Critical Low": 1,
      "High Waste": 2,
      Low: 3,
      Overstocked: 4,
      Optimal: 5,
    };

    recommendations.sort(
      (a, b) => statusPriority[a.status] - statusPriority[b.status]
    );

    return res.json({
      totalItems: recommendations.length,
      criticalItems: recommendations.filter(
        (item) => item.status === "Critical Low"
      ).length,
      highWasteItems: recommendations.filter(
        (item) => item.status === "High Waste"
      ).length,
      recommendations,
    });
  } catch (error) {
    console.error("Error generating inventory optimization:", error);
    return res.status(500).json({
      error: "Failed to generate inventory optimization",
      details: error.message,
    });
  }
});

/**
 * POST /api/suggestions/mark-as-special
 * Marks a recipe as a special, typically used after accepting a suggestion
 */
router.post("/mark-as-special", async (req, res) => {
  try {
    const { recipeId, isSpecial = true } = req.body;

    if (!recipeId) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        isSpecial,
      },
    });

    return res.json({
      message: `Recipe ${updatedRecipe.name} has been ${
        isSpecial ? "marked as" : "removed from"
      } special`,
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Error updating recipe special status:", error);
    return res.status(500).json({
      error: "Failed to update recipe special status",
      details: error.message,
    });
  }
});

/**
 * POST /api/suggestions/create-waste-prevention-menu
 * Creates a new menu based on expiring ingredients to prevent waste
 */
router.post("/create-waste-prevention-menu", async (req, res) => {
  try {
    const { restaurantId, name, description, recipeIds } = req.body;

    if (!restaurantId || !name || !recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({
        error: "Restaurant ID, menu name, and recipe IDs array are required",
      });
    }

    // Create new menu
    const newMenu = await prisma.menu.create({
      data: {
        name,
        description:
          description ||
          `Waste prevention menu created ${new Date().toLocaleDateString()}`,
        isActive: true,
        startDate: new Date(),
        restaurant: {
          connect: { id: restaurantId },
        },
      },
    });

    // Add recipes to menu
    const menuItemsData = recipeIds.map((recipeId, index) => ({
      menuId: newMenu.id,
      recipeId,
      section: "Specials",
      order: index,
    }));

    await prisma.menuItems.createMany({
      data: menuItemsData,
    });

    // Get complete menu with items
    const completedMenu = await prisma.menu.findUnique({
      where: { id: newMenu.id },
      include: {
        items: {
          include: {
            recipe: true,
          },
        },
      },
    });

    return res.json({
      message: `Created new waste prevention menu "${name}" with ${recipeIds.length} recipes`,
      menu: completedMenu,
    });
  } catch (error) {
    console.error("Error creating waste prevention menu:", error);
    return res.status(500).json({
      error: "Failed to create waste prevention menu",
      details: error.message,
    });
  }
});

module.exports = router;
