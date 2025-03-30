const prisma = require("../lib/prisma");

/**
 * Get all sales data for a restaurant
 */
const getAllSalesData = async (req, res) => {
  try {
    // const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const salesData = await prisma.salesData.findMany({
      where: { restaurantId },
      include: { recipe: true },
      orderBy: { date: "desc" },
    });

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Get sales data error:", error);
    res.status(500).json({ message: "Server error while fetching sales data" });
  }
};

/**
 * Get sales data by date range
 */
const getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const salesData = await prisma.salesData.findMany({
      where: {
        restaurantId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: { recipe: true },
    });

    // Calculate total revenue
    const totalRevenue = salesData.reduce((total, sale) => {
      return total + sale.revenue;
    }, 0);

    // Group by recipe
    const salesByRecipe = await prisma.$queryRaw`
      SELECT 
        r.id as recipeId, 
        r.name as recipeName, 
        r.category, 
        SUM(s.quantitySold) as totalQuantity, 
        SUM(s.revenue) as totalRevenue
      FROM "SalesData" s
      JOIN "Recipe" r ON s.recipeId = r.id
      WHERE s.restaurantId = ${restaurantId}
        AND s.date >= ${start}
        AND s.date <= ${end}
      GROUP BY r.id, r.name, r.category
      ORDER BY totalQuantity DESC
    `;

    // Group by date
    const salesByDate = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', s.date) as date, 
        SUM(s.revenue) as revenue,
        COUNT(DISTINCT s.recipeId) as uniqueItems
      FROM "SalesData" s
      WHERE s.restaurantId = ${restaurantId}
        AND s.date >= ${start}
        AND s.date <= ${end}
      GROUP BY DATE_TRUNC('day', s.date)
      ORDER BY date
    `;

    res.status(200).json({
      salesData,
      totalRevenue,
      salesByRecipe,
      salesByDate,
      startDate: start,
      endDate: end,
    });
  } catch (error) {
    console.error("Get sales by date range error:", error);
    res.status(500).json({ message: "Server error while fetching sales data" });
  }
};

/**
 * Create a new sales record
 */
const createSalesRecord = async (req, res) => {
  try {
    const { recipeId, quantitySold, revenue, date } = req.body;
    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    if (!recipeId || !quantitySold || !revenue) {
      return res.status(400).json({
        message: "Recipe ID, quantity sold, and revenue are required",
      });
    }

    // Check if recipe exists and belongs to the restaurant
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        restaurantId,
      },
      include: { ingredients: true },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Create sales record and update inventory in transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create sales record
      const salesRecord = await prisma.salesData.create({
        data: {
          recipeId,
          quantitySold: parseInt(quantitySold),
          revenue: parseFloat(revenue),
          date: date ? new Date(date) : new Date(),
          restaurantId,
        },
        include: { recipe: true },
      });

      // Update inventory for each ingredient
      for (const ingredient of recipe.ingredients) {
        // Get current inventory
        const inventoryItem = await prisma.inventoryItem.findUnique({
          where: { id: ingredient.inventoryItemId },
        });

        if (inventoryItem) {
          const usedQuantity = ingredient.quantity * quantitySold;

          // Update inventory quantity if there's enough left
          if (inventoryItem.quantity >= usedQuantity) {
            await prisma.inventoryItem.update({
              where: { id: ingredient.inventoryItemId },
              data: {
                quantity: {
                  decrement: usedQuantity,
                },
              },
            });
          } else {
            // If not enough inventory, just set to 0
            await prisma.inventoryItem.update({
              where: { id: ingredient.inventoryItemId },
              data: {
                quantity: 0,
              },
            });
          }
        }
      }

      return salesRecord;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Create sales record error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating sales record" });
  }
};

module.exports = {
  getAllSalesData,
  getSalesByDateRange,
  createSalesRecord,
};
