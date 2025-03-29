const express = require("express");
const router = express.Router();
const forecastController = require("../controllers/forecastController");

// Get sales forecasts
router.get("/sales", forecastController.getSalesForecasts);

// Get inventory forecasts
router.get("/inventory", forecastController.getInventoryForecasts);

// Get waste predictions
router.get("/waste", forecastController.getWastePredictions);

// Generate new forecast
router.post("/generate", forecastController.generateForecast);

module.exports = router;
