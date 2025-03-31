const prisma = require("../lib/prisma");

/**
 * Get all inventory items for a restaurant
 */
const getAllInventoryItems = async (req, res) => {
  try {
    // const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: { restaurantId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error("Get inventory items error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching inventory items" });
  }
};

/**
 * Get a single inventory item by ID
 */
const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    // const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!id) {
      return res.status(400).json({ message: "Inventory item ID is required" });
    }

    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: {
        id,
        restaurantId,
      },
    });

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error("Get inventory item error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching inventory item" });
  }
};

/**
 * Create a new inventory item
 */
const createInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      unit,
      minQuantity,
      purchaseDate,
      expiryDate,
      imageUrl,
      cost,
    } = req.body;
    console.log(req.body);
    // const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    // Basic validation
    if (
      !name ||
      !category ||
      quantity === undefined ||
      !unit ||
      cost === undefined
    ) {
      return res.status(400).json({
        message: "Name, category, quantity, unit, and cost are required fields",
      });
    }

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        quantity: parseFloat(quantity),
        unit,
        minQuantity,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        imageUrl,
        cost: parseFloat(cost),
        restaurantId,
      },
    });

    res.status(201).json(inventoryItem);
  } catch (error) {
    console.error("Create inventory item error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating inventory item" });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    //   const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    const {
      name,
      category,
      quantity,
      unit,
      purchaseDate,
      expiryDate,
      imageUrl,
      cost,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Inventory item ID is required" });
    }

    // Check if item exists and belongs to the restaurant
    const existingItem = await prisma.inventoryItem.findFirst({
      where: {
        id,
        restaurantId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Update the item
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingItem.name,
        category: category !== undefined ? category : existingItem.category,
        quantity:
          quantity !== undefined ? parseFloat(quantity) : existingItem.quantity,
        unit: unit !== undefined ? unit : existingItem.unit,
        purchaseDate: purchaseDate
          ? new Date(purchaseDate)
          : existingItem.purchaseDate,
        expiryDate: expiryDate ? new Date(expiryDate) : existingItem.expiryDate,
        imageUrl: imageUrl !== undefined ? imageUrl : existingItem.imageUrl,
        cost: cost !== undefined ? parseFloat(cost) : existingItem.cost,
      },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Update inventory item error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating inventory item" });
  }
};

/**
 * Delete an inventory item
 */
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    // const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!id) {
      return res.status(400).json({ message: "Inventory item ID is required" });
    }

    // Check if item exists and belongs to the restaurant
    const existingItem = await prisma.inventoryItem.findFirst({
      where: {
        id,
        restaurantId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Delete the item
    await prisma.inventoryItem.delete({
      where: { id },
    });

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("Delete inventory item error:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting inventory item" });
  }
};

/**
 * Get inventory items that are near expiry date
 */
const getExpiringItems = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    //const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    // Calculate date threshold
    const today = new Date();
    const threshold = new Date(today);
    threshold.setDate(today.getDate() + parseInt(days));

    const expiringItems = await prisma.inventoryItem.findMany({
      where: {
        restaurantId,
        expiryDate: {
          not: null,
          lt: threshold,
          gt: today,
        },
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    res.status(200).json(expiringItems);
  } catch (error) {
    console.error("Get expiring items error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching expiring items" });
  }
};

module.exports = {
  getAllInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getExpiringItems,
};
