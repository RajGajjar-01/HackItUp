const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const aiService = require("../services/aiService");
const { getCached, setCached } = require("../services/cacheService");

const CACHE_TTL = 60 * 10; // 10 minutes for menu items

exports.getAllMenuItems = async (req, res, next) => {
  try {
    const { restaurantId, category } = req.query;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    // Check if data is in cache
    const cacheKey = `menu:items:all:${restaurantId}:${category || "all"}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Build query
    const query = {
      where: {
        restaurantId: parseInt(restaurantId),
        isActive: true,
      },
      include: {
        ingredients: {
          include: {
            inventory: true,
          },
        },
      },
      orderBy: { name: "asc" },
    };

    // Add category filter if provided
    if (category) {
      query.where.category = category;
    }

    const menuItems = await prisma.menuItem.findMany(query);

    // Set cache
    await setCached(cacheKey, menuItems, CACHE_TTL);

    res.json(menuItems);
  } catch (error) {
    next(error);
  }
};

exports.getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if data is in cache
    const cacheKey = `menu:items:${id}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        ingredients: {
          include: {
            inventory: true,
          },
        },
        salesData: {
          orderBy: {
            date: "desc",
          },
          take: 30,
        },
      },
    });

    if (!menuItem) {
      return res
        .status(404)
        .json({ error: true, message: "Menu item not found" });
    }

    // Set cache
    await setCached(cacheKey, menuItem, CACHE_TTL);

    res.json(menuItem);
  } catch (error) {
    next(error);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const { name, price, category, restaurantId, ingredients = [] } = req.body;

    // Create the menu item with ingredients
    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        category,
        restaurant: {
          connect: { id: parseInt(restaurantId) },
        },
        ingredients: {
          create: ingredients.map((ing) => ({
            quantity: ing.quantity,
            unit: ing.unit,
            inventory: {
              connect: { id: parseInt(ing.inventoryId) },
            },
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            inventory: true,
          },
        },
      },
    });

    // Invalidate cache
    await setCached(`menu:items:all:${restaurantId}:all`, null, 0);
    await setCached(`menu:items:all:${restaurantId}:${category}`, null, 0);

    res.status(201).json(newMenuItem);
  } catch (error) {
    next(error);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category, isActive, ingredients = [] } = req.body;

    // Get the current menu item to find the restaurant ID
    const currentMenuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: { ingredients: true },
    });

    if (!currentMenuItem) {
      return res
        .status(404)
        .json({ error: true, message: "Menu item not found" });
    }

    // Start a transaction to update the menu item and its ingredients
    const updatedMenuItem = await prisma.$transaction(async (tx) => {
      // 1. Delete existing ingredients
      await tx.menuItemIngredient.deleteMany({
        where: { menuItemId: parseInt(id) },
      });

      // 2. Update the menu item
      const updated = await tx.menuItem.update({
        where: { id: parseInt(id) },
        data: {
          name,
          price,
          category,
          isActive,
          ingredients: {
            create: ingredients.map((ing) => ({
              quantity: ing.quantity,
              unit: ing.unit,
              inventory: {
                connect: { id: parseInt(ing.inventoryId) },
              },
            })),
          },
        },
        include: {
          ingredients: {
            include: {
              inventory: true,
            },
          },
        },
      });

      return updated;
    });

    // Invalidate caches
    await setCached(`menu:items:${id}`, null, 0);
    await setCached(
      `menu:items:all:${currentMenuItem.restaurantId}:all`,
      null,
      0
    );
    await setCached(
      `menu:items:all:${currentMenuItem.restaurantId}:${currentMenuItem.category}`,
      null,
      0
    );
    if (category !== currentMenuItem.category) {
      await setCached(
        `menu:items:all:${currentMenuItem.restaurantId}:${category}`,
        null,
        0
      );
    }

    res.json(updatedMenuItem);
  } catch (error) {
    next(error);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get the current menu item to find the restaurant ID
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!menuItem) {
      return res
        .status(404)
        .json({ error: true, message: "Menu item not found" });
    }

    // Delete the menu item
    await prisma.menuItem.delete({
      where: { id: parseInt(id) },
    });

    // Invalidate caches
    await setCached(`menu:items:${id}`, null, 0);
    await setCached(`menu:items:all:${menuItem.restaurantId}:all`, null, 0);
    await setCached(
      `menu:items:all:${menuItem.restaurantId}:${menuItem.category}`,
      null,
      0
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getMenuOptimizations = async (req, res, next) => {
  try {
    const { restaurantId, implemented } = req.query;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    // Check if data is in cache
    const implStatus =
      implemented === "true" ? true : implemented === "false" ? false : null;
    const cacheKey = `menu:optimizations:${restaurantId}:${
      implStatus === null ? "all" : implStatus
    }`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Build where clause
    const where = {};

    // Filter by implemented status if provided
    if (implStatus !== null) {
      where.implemented = implStatus;
    }

    const optimizations = await prisma.menuOptimization.findMany({
      where,
      orderBy: {
        potentialImpact: "desc",
      },
    });

    // Set cache
    await setCached(cacheKey, optimizations, CACHE_TTL);

    res.json(optimizations);
  } catch (error) {
    next(error);
  }
};

exports.generateMenuOptimizations = async (req, res, next) => {
  try {
    const { restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({
        error: true,
        message: "Restaurant ID is required",
      });
    }

    // Call AI service to generate menu optimizations
    const optimizations = await aiService.generateMenuOptimizations(
      parseInt(restaurantId)
    );

    // Save optimizations to database
    const savedOptimizations = [];

    for (const opt of optimizations) {
      const saved = await prisma.menuOptimization.create({
        data: opt,
      });
      savedOptimizations.push(saved);
    }

    // Invalidate cache
    await setCached(`menu:optimizations:${restaurantId}:all`, null, 0);
    await setCached(`menu:optimizations:${restaurantId}:false`, null, 0);

    res.status(201).json({
      success: true,
      optimizations: savedOptimizations,
    });
  } catch (error) {
    next(error);
  }
};

exports.implementOptimization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { restaurantId } = req.body;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    // Mark optimization as implemented
    const updatedOptimization = await prisma.menuOptimization.update({
      where: { id: parseInt(id) },
      data: {
        implemented: true,
      },
    });

    // Invalidate caches
    await setCached(`menu:optimizations:${restaurantId}:all`, null, 0);
    await setCached(`menu:optimizations:${restaurantId}:false`, null, 0);
    await setCached(`menu:optimizations:${restaurantId}:true`, null, 0);

    res.json(updatedOptimization);
  } catch (error) {
    next(error);
  }
};
