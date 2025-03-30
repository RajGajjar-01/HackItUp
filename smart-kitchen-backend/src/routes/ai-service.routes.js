const express = require("express");
const {
  processInventoryImage,
  detectFoodSpoilage,
  getPredictions,
  generateRecipes,
  analyzeWaste,
} = require("../controllers/ai-service.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication middleware to all AI routes
router.use(authenticate);

/**
 * @route   POST /api/ai/inventory/image
 * @desc    Process image to detect inventory items
 * @access  Private
 */
router.post("/inventory/image", processInventoryImage);

/**
 * @route   POST /api/ai/inventory/spoilage
 * @desc    Detect food spoilage from image
 * @access  Private
 */
router.post("/inventory/spoilage", detectFoodSpoilage);

/**
 * @route   GET /api/ai/predictions
 * @desc    Get sales and inventory predictions
 * @access  Private
 */
router.get("/predictions", getPredictions);

/**
 * @route   POST /api/ai/recipes
 * @desc    Generate recipe suggestions based on inventory
 * @access  Private
 */
router.post("/recipes", generateRecipes);

/**
 * @route   POST /api/ai/waste
 * @desc    Analyze waste from image
 * @access  Private
 */
router.post("/waste", analyzeWaste);

module.exports = router;
