const prisma = require("../lib/prisma");

/**
 * Get all waste records for a restaurant
 */
const getAllWasteRecords = async (req, res) => {
  try {
    //   const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const wasteRecords = await prisma.wasteRecord.findMany({
      where: { restaurantId },
      include: { inventoryItem: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(wasteRecords);
  } catch (error) {
    console.error("Get waste records error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching waste records" });
  }
};

/**
 * Get a single waste record by ID
 */
const getWasteRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;

    const wasteRecord = await prisma.wasteRecord.findFirst({
      where: {
        id,
        restaurantId,
      },
      include: { inventoryItem: true },
    });

    if (!wasteRecord) {
      return res.status(404).json({ message: "Waste record not found" });
    }

    res.status(200).json(wasteRecord);
  } catch (error) {
    console.error("Get waste record error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching waste record" });
  }
};

/**
 * Create a new waste record
 */
const createWasteRecord = async (req, res) => {
  try {
    const { inventoryItemId, quantity, reason, imageUrl } = req.body;
    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    if (!inventoryItemId || !quantity || !reason) {
      return res.status(400).json({
        message: "Inventory item ID, quantity, and reason are required",
      });
    }

    // Check if inventory item exists and belongs to the restaurant
    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: {
        id: inventoryItemId,
        restaurantId,
      },
    });

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Start a transaction to update inventory and create waste record
    const result = await prisma.$transaction(async (prisma) => {
      // Create waste record
      const wasteRecord = await prisma.wasteRecord.create({
        data: {
          inventoryItemId,
          quantity: parseFloat(quantity),
          reason,
          imageUrl,
          restaurantId,
        },
        include: { inventoryItem: true },
      });

      // Update inventory quantity if there's enough left
      if (inventoryItem.quantity >= parseFloat(quantity)) {
        await prisma.inventoryItem.update({
          where: { id: inventoryItemId },
          data: {
            quantity: {
              decrement: parseFloat(quantity),
            },
          },
        });
      } else {
        // If not enough inventory, just set to 0
        await prisma.inventoryItem.update({
          where: { id: inventoryItemId },
          data: {
            quantity: 0,
          },
        });
      }

      return wasteRecord;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Create waste record error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating waste record" });
  }
};

/**
 * Get waste data by date range
 */
const getWasteByDateRange = async (req, res) => {
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

    const wasteRecords = await prisma.wasteRecord.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: { inventoryItem: true },
    });

    // Calculate total cost of waste
    const totalWasteCost = wasteRecords.reduce((total, record) => {
      const itemCost = record.inventoryItem.cost;
      return total + itemCost * record.quantity;
    }, 0);

    // Group by reason
    const wasteByReason = wasteRecords.reduce((acc, record) => {
      const reason = record.reason;
      if (!acc[reason]) {
        acc[reason] = {
          count: 0,
          quantity: 0,
          cost: 0,
        };
      }

      acc[reason].count += 1;
      acc[reason].quantity += record.quantity;
      acc[reason].cost += record.inventoryItem.cost * record.quantity;

      return acc;
    }, {});

    res.status(200).json({
      records: wasteRecords,
      totalWasteCost,
      wasteByReason,
      startDate: start,
      endDate: end,
    });
  } catch (error) {
    console.error("Get waste by date range error:", error);
    res.status(500).json({ message: "Server error while fetching waste data" });
  }
};

module.exports = {
  getAllWasteRecords,
  getWasteRecordById,
  createWasteRecord,
  getWasteByDateRange,
};
