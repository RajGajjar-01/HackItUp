const express = require("express");
const {
  getAllInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getExpiringItems,
} = require("../controllers/inventory.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication middleware to all inventory routes
// router.use(authenticate);

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory items for a restaurant
 * @access  Private
 */
router.get("/", getAllInventoryItems);

/**
 * @route   GET /api/inventory/expiring
 * @desc    Get inventory items that are near expiry date
 * @access  Private
 */
router.get("/expiring", getExpiringItems);

/**
 * @route   GET /api/inventory/:id
 * @desc    Get a single inventory item by ID
 * @access  Private
 */
router.get("/:id", getInventoryItemById);

/**
 * @route   POST /api/inventory
 * @desc    Create a new inventory item
 * @access  Private
 */
router.post("/", createInventoryItem);

/**
 * @route   PUT /api/inventory/:id
 * @desc    Update an existing inventory item
 * @access  Private
 */
router.put("/:id", updateInventoryItem);

/**
 * @route   DELETE /api/inventory/:id
 * @desc    Delete an inventory item
 * @access  Private
 */
router.delete("/:id", deleteInventoryItem);

module.exports = router;
