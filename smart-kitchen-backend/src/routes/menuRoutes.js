const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { validateMenuItem } = require("../middleware/validation");

// Get all menu items
router.get("/items", menuController.getAllMenuItems);

// Get a single menu item
router.get("/items/:id", menuController.getMenuItemById);

// Create a new menu item
router.post("/items", validateMenuItem, menuController.createMenuItem);

// Update a menu item
router.put("/items/:id", validateMenuItem, menuController.updateMenuItem);

// Delete a menu item
router.delete("/items/:id", menuController.deleteMenuItem);

// Get menu optimization suggestions
router.get("/optimizations", menuController.getMenuOptimizations);

// Generate new menu optimizations
router.post(
  "/optimizations/generate",
  menuController.generateMenuOptimizations
);

// Mark optimization as implemented
router.patch(
  "/optimizations/:id/implement",
  menuController.implementOptimization
);

module.exports = router;
