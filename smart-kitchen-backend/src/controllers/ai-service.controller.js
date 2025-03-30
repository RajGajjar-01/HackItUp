const aiService = require("../utils/ai-service");

const processInventoryImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    //const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!imageBase64) {
      return res.status(400).json({ message: "Image data is required" });
    }

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const result = await aiService.processInventoryImage(
      imageBase64,
      restaurantId
    );

    if (result.error) {
      return res.status(result.status || 500).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Process inventory image error:", error);
    res.status(500).json({ message: "Server error while processing image" });
  }
};

/**
 * Detect food spoilage from image
 */
const detectFoodSpoilage = async (req, res) => {
  try {
    const { imageBase64, inventoryItemId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: "Image data is required" });
    }

    if (!inventoryItemId) {
      return res.status(400).json({ message: "Inventory item ID is required" });
    }

    const result = await aiService.detectFoodSpoilage(
      imageBase64,
      inventoryItemId
    );

    if (result.error) {
      return res.status(result.status || 500).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Detect food spoilage error:", error);
    res
      .status(500)
      .json({ message: "Server error while detecting food spoilage" });
  }
};

/**
 * Get predictions for inventory demand and sales
 */
const getPredictions = async (req, res) => {
  try {
    const { days } = req.query;
    //  const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const result = await aiService.getPredictions(
      restaurantId,
      days ? parseInt(days) : 7
    );

    if (result.error) {
      return res.status(result.status || 500).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Get predictions error:", error);
    res.status(500).json({ message: "Server error while getting predictions" });
  }
};

/**
 * Generate recipe suggestions based on current inventory
 */
const generateRecipes = async (req, res) => {
  try {
    const { expiringItems } = req.body;
    //const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const result = await aiService.generateRecipes(
      restaurantId,
      expiringItems || []
    );

    if (result.error) {
      return res.status(result.status || 500).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Generate recipes error:", error);
    res.status(500).json({ message: "Server error while generating recipes" });
  }
};

/**
 * Analyze waste from image
 */
const analyzeWaste = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    //   const restaurantId = req.user.restaurantId;
    const restaurantId = req.query.restaurantId; // For testing purposes, use query param instead of auth
    if (!imageBase64) {
      return res.status(400).json({ message: "Image data is required" });
    }

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const result = await aiService.analyzeWaste(imageBase64, restaurantId);

    if (result.error) {
      return res.status(result.status || 500).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Analyze waste error:", error);
    res.status(500).json({ message: "Server error while analyzing waste" });
  }
};

module.exports = {
  processInventoryImage,
  detectFoodSpoilage,
  getPredictions,
  generateRecipes,
  analyzeWaste,
};
