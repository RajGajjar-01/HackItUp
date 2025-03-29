const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const aiService = require("../services/aiService");
const { cache, getCached, setCached } = require("../services/cacheService");

const CACHE_TTL = 60 * 5; // 5 minutes cache

exports.getAllInventory = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;

    // Check if data is in cache
    const cacheKey = `inventory:all:${restaurantId}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    const inventory = await prisma.inventory.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      orderBy: { name: "asc" },
    });

    // Set cache
    await setCached(cacheKey, inventory, CACHE_TTL);

    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

exports.getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if data is in cache
    const cacheKey = `inventory:${id}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const inventory = await prisma.inventory.findUnique({
      where: { id: parseInt(id) },
      include: {
        menuItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!inventory) {
      return res
        .status(404)
        .json({ error: true, message: "Inventory item not found" });
    }

    // Set cache
    await setCached(cacheKey, inventory, CACHE_TTL);

    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

exports.createInventory = async (req, res, next) => {
  try {
    const {
      name,
      category,
      quantity,
      unit,
      minThreshold,
      restaurantId,
      imageUrl,
    } = req.body;

    const newInventory = await prisma.inventory.create({
      data: {
        name,
        category,
        quantity,
        unit,
        minThreshold,
        imageUrl,
        restaurant: {
          connect: { id: parseInt(restaurantId) },
        },
      },
    });

    // Invalidate cache
    await cache.del(`inventory:all:${restaurantId}`);

    res.status(201).json(newInventory);
  } catch (error) {
    next(error);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unit, minThreshold, imageUrl } = req.body;

    // Get the current inventory to find the restaurant ID
    const currentInventory = await prisma.inventory.findUnique({
      where: { id: parseInt(id) },
    });

    if (!currentInventory) {
      return res
        .status(404)
        .json({ error: true, message: "Inventory item not found" });
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category,
        quantity,
        unit,
        minThreshold,
        imageUrl,
        lastUpdated: new Date(),
      },
    });

    // Invalidate caches
    await cache.del(`inventory:${id}`);
    await cache.del(`inventory:all:${currentInventory.restaurantId}`);
    await cache.del("inventory:alerts:low");

    res.json(updatedInventory);
  } catch (error) {
    next(error);
  }
};

exports.deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get the current inventory to find the restaurant ID
    const inventory = await prisma.inventory.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inventory) {
      return res
        .status(404)
        .json({ error: true, message: "Inventory item not found" });
    }

    await prisma.inventory.delete({
      where: { id: parseInt(id) },
    });

    // Invalidate caches
    await cache.del(`inventory:${id}`);
    await cache.del(`inventory:all:${inventory.restaurantId}`);
    await cache.del("inventory:alerts:low");

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.trackInventoryWithCV = async (req, res, next) => {
  try {
    const { imageData, restaurantId } = req.body;

    if (!imageData || !restaurantId) {
      return res.status(400).json({
        error: true,
        message: "Image data and restaurant ID are required",
      });
    }

    // Call AI service to process the image
    const detectedItems = await aiService.detectInventoryFromImage(imageData);

    // Update inventory based on detected items
    const updates = [];

    for (const item of detectedItems) {
      // Find the inventory item by name
      const inventoryItem = await prisma.inventory.findFirst({
        where: {
          name: { equals: item.name, mode: "insensitive" },
          restaurantId: parseInt(restaurantId),
        },
      });

      if (inventoryItem) {
        // Update the quantity
        const update = await prisma.inventory.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: item.quantity,
            lastUpdated: new Date(),
          },
        });
        updates.push(update);
      }
    }

    // Invalidate cache
    await cache.del(`inventory:all:${restaurantId}`);
    await cache.del("inventory:alerts:low");

    res.json({
      success: true,
      updatedItems: updates.length,
      updates,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLowInventoryAlerts = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    // Check if data is in cache
    const cacheKey = "inventory:alerts:low";
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Find inventory items below threshold
    const lowItems = await prisma.inventory.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        quantity: {
          lt: prisma.inventory.fields.minThreshold,
        },
      },
    });

    // Set cache (short TTL for alerts)
    await setCached(cacheKey, lowItems, 60); // 1 minute

    res.json(lowItems);
  } catch (error) {
    next(error);
  }
};
