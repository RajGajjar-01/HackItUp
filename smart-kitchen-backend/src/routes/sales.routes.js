const express = require("express");
const {
  getAllSalesData,
  getSalesByDateRange,
  createSalesRecord,
} = require("../controllers/sales.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication middleware to all sales routes
// router.use(authenticate);

/**
 * @route   GET /api/sales
 * @desc    Get all sales data for a restaurant
 * @access  Private
 */
router.get("/", getAllSalesData);

/**
 * @route   GET /api/sales/analytics
 * @desc    Get sales data by date range
 * @access  Private
 */
router.get("/analytics", getSalesByDateRange);

/**
 * @route   POST /api/sales
 * @desc    Create a new sales record
 * @access  Private
 */
router.post("/", createSalesRecord);

module.exports = router;
