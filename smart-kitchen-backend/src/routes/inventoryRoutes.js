const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { validateInventory } = require("../middleware/validation");

// Get all inventory items
router.get("/", inventoryController.getAllInventory);

// Get a single inventory item
router.get("/:id", inventoryController.getInventoryById);

// Create a new inventory item
router.post("/", validateInventory, inventoryController.createInventory);

// Update an inventory item
router.put("/:id", validateInventory, inventoryController.updateInventory);

// Delete an inventory item
router.delete("/:id", inventoryController.deleteInventory);

// Track inventory with computer vision
router.post("/track", inventoryController.trackInventoryWithCV);

// Get low inventory alerts
router.get("/alerts/low", inventoryController.getLowInventoryAlerts);

module.exports = router;
