const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Configure AI service connection
const AI_SERVICE_BASE_URL =
  process.env.AI_SERVICE_BASE_URL || "http://localhost:5000";
const AI_SERVICE_TIMEOUT = 30000; // 30 seconds

// Create axios instance for AI service
const aiClient = axios.create({
  baseURL: AI_SERVICE_BASE_URL,
  timeout: AI_SERVICE_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Error handler
const handleAiServiceError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("AI service error:", error.response.data);
    throw new Error(
      `AI service error: ${error.response.data.message || "Unknown error"}`
    );
  } else if (error.request) {
    // The request was made but no response was received
    console.error("AI service timeout or no response");
    throw new Error("AI service is unavailable or timed out");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up AI service request:", error.message);
    throw new Error(`Error connecting to AI service: ${error.message}`);
  }
};

/**
 * Detect inventory items from an image using computer vision
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<Array>} Detected inventory items
 */
exports.detectInventoryFromImage = async (imageData) => {
  try {
    const response = await aiClient.post("/detect-inventory", {
      image: imageData,
    });

    return response.data.items;
  } catch (error) {
    handleAiServiceError(error);
  }
};

/**
 * Generate sales forecasts for a restaurant
 * @param {number} restaurantId - Restaurant ID
 * @param {number} days - Number of days to forecast
 * @returns {Promise<Array>} Sales forecasts
 */
exports.generateSalesForecast = async (restaurantId, days) => {
  try {
    // Get historical sales data
    const salesData = await prisma.salesData.findMany({
      where: {
        menuItem: {
          restaurantId,
        },
      },
      include: {
        menuItem: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 90, // Last 90 days of data
    });

    // Prepare data for AI service
    const formattedData = salesData.map((record) => ({
      date: record.date.toISOString().split("T")[0],
      menuItemId: record.menuItemId,
      menuItemName: record.menuItem.name,
      quantity: record.quantity,
    }));

    // Call AI service
    const response = await aiClient.post("/forecast/sales", {
      restaurantId,
      historicalData: formattedData,
      days,
    });

    // Format the response for database storage
    return response.data.forecasts.map((forecast) => ({
      restaurantId,
      forecastDate: new Date(forecast.date),
      forecastType: "sales",
      itemId: forecast.menuItemId,
      itemType: "menuItem",
      predictedValue: forecast.predictedSales,
      confidence: forecast.confidence,
    }));
  } catch (error) {
    handleAiServiceError(error);
  }
};

/**
 * Generate inventory forecasts for a restaurant
 * @param {number} restaurantId - Restaurant ID
 * @param {number} days - Number of days to forecast
 * @returns {Promise<Array>} Inventory forecasts
 */
exports.generateInventoryForecast = async (restaurantId, days) => {
  try {
    // Get current inventory data
    const inventoryItems = await prisma.inventory.findMany({
      where: { restaurantId },
      include: {
        menuItems: {
          include: {
            menuItem: {
              include: {
                salesData: {
                  orderBy: {
                    date: "desc",
                  },
                  take: 30, // Last 30 days
                },
              },
            },
          },
        },
      },
    });

    // Get sales forecasts to predict inventory usage
    const salesForecasts = await prisma.forecast.findMany({
      where: {
        restaurantId,
        forecastType: "sales",
        forecastDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        forecastDate: "asc",
      },
      take: days,
    });

    // Prepare data for AI service
    const data = {
      restaurantId,
      inventory: inventoryItems.map((item) => ({
        id: item.id,
        name: item.name,
        currentQuantity: item.quantity,
        unit: item.unit,
        usageInMenuItems: item.menuItems.map((relation) => ({
          menuItemId: relation.menuItemId,
          menuItemName: relation.menuItem.name,
          quantityPerItem: relation.quantity,
        })),
      })),
      salesForecasts: salesForecasts.map((forecast) => ({
        date: forecast.forecastDate.toISOString().split("T")[0],
        menuItemId: forecast.itemId,
        predictedSales: forecast.predictedValue,
      })),
      days,
    };

    // Call AI service
    const response = await aiClient.post("/forecast/inventory", data);

    // Format the response for database storage
    return response.data.forecasts.map((forecast) => ({
      restaurantId,
      forecastDate: new Date(forecast.date),
      forecastType: "inventory",
      itemId: forecast.inventoryItemId,
      itemType: "inventory",
      predictedValue: forecast.predictedQuantity,
      confidence: forecast.confidence,
    }));
  } catch (error) {
    handleAiServiceError(error);
  }
};

/**
 * Generate waste predictions for a restaurant
 * @param {number} restaurantId - Restaurant ID
 * @param {number} days - Number of days to predict
 * @returns {Promise<Array>} Waste predictions
 */
exports.generateWastePrediction = async (restaurantId, days) => {
  try {
    // Get inventory and sales data
    const inventoryItems = await prisma.inventory.findMany({
      where: { restaurantId },
    });

    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId },
      include: {
        salesData: {
          orderBy: {
            date: "desc",
          },
          take: 30,
        },
      },
    });

    // Prepare data for AI service
    const data = {
      restaurantId,
      inventory: inventoryItems,
      menuItems,
      days,
    };

    // Call AI service
    const response = await aiClient.post("/forecast/waste", data);

    // Format the response for database storage
    return response.data.forecasts.map((forecast) => ({
      restaurantId,
      forecastDate: new Date(forecast.date),
      forecastType: "waste",
      itemId: forecast.itemId,
      itemType: forecast.itemType, // 'inventory' or 'menuItem'
      predictedValue: forecast.predictedWaste,
      confidence: forecast.confidence,
    }));
  } catch (error) {
    handleAiServiceError(error);
  }
};

/**
 * Generate menu optimization suggestions
 * @param {number} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Menu optimization suggestions
 */
exports.generateMenuOptimizations = async (restaurantId) => {
  try {
    // Get restaurant data for optimization
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId },
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
          take: 90,
        },
      },
    });

    const inventoryItems = await prisma.inventory.findMany({
      where: { restaurantId },
    });

    // Get forecasts
    const forecasts = await prisma.forecast.findMany({
      where: {
        restaurantId,
        forecastDate: {
          gte: new Date(),
        },
      },
    });

    // Prepare data for AI service
    const data = {
      restaurantId,
      menuItems,
      inventory: inventoryItems,
      forecasts,
    };

    // Call AI service
    const response = await aiClient.post("/menu/optimize", data);

    // Return menu optimization suggestions
    return response.data.optimizations;
  } catch (error) {
    handleAiServiceError(error);
  }
};
