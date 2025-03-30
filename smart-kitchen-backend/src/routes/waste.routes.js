const express = require("express");
const {
  getAllWasteRecords,
  getWasteRecordById,
  createWasteRecord,
  getWasteByDateRange,
} = require("../controllers/waste.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication middleware to all waste routes
// router.use(authenticate);

/**
 * @route   GET /api/waste
 * @desc    Get all waste records for a restaurant
 * @access  Private
 */
router.get("/", getAllWasteRecords);

/**
 * @route   GET /api/waste/analytics
 * @desc    Get waste data by date range
 * @access  Private
 */
router.get("/analytics", getWasteByDateRange);

/**
 * @route   GET /api/waste/:id
 * @desc    Get a single waste record by ID
 * @access  Private
 */
router.get("/:id", getWasteRecordById);

/**
 * @route   POST /api/waste
 * @desc    Create a new waste record
 * @access  Private
 */
router.post("/", createWasteRecord);

module.exports = router;
