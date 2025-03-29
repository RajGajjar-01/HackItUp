const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const aiService = require("../services/aiService");
const { getCached, setCached } = require("../services/cacheService");

const CACHE_TTL = 60 * 15; // 15 minutes for forecasts

exports.getSalesForecasts = async (req, res, next) => {
  try {
    const { restaurantId, days = 7 } = req.query;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    // Check if data is in cache
    const cacheKey = `forecast:sales:${restaurantId}:${days}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Get date range
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const forecasts = await prisma.forecast.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        forecastType: "sales",
        forecastDate: {
          lte: endDate,
        },
      },
      orderBy: {
        forecastDate: "asc",
      },
    });

    // If we have less than requested days, generate new forecasts
    if (forecasts.length < parseInt(days)) {
      const newForecasts = await aiService.generateSalesForecast(
        parseInt(restaurantId),
        parseInt(days)
      );

      // Save new forecasts to database
      for (const forecast of newForecasts) {
        await prisma.forecast.create({
          data: forecast,
        });
      }

      // Fetch updated forecasts
      const updatedForecasts = await prisma.forecast.findMany({
        where: {
          restaurantId: parseInt(restaurantId),
          forecastType: "sales",
          forecastDate: {
            lte: endDate,
          },
        },
        orderBy: {
          forecastDate: "asc",
        },
      });

      // Set cache
      await setCached(cacheKey, updatedForecasts, CACHE_TTL);

      return res.json(updatedForecasts);
    }

    // Set cache
    await setCached(cacheKey, forecasts, CACHE_TTL);

    res.json(forecasts);
  } catch (error) {
    next(error);
  }
};

exports.getInventoryForecasts = async (req, res, next) => {
  try {
    const { restaurantId, days = 7 } = req.query;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    // Check if data is in cache
    const cacheKey = `forecast:inventory:${restaurantId}:${days}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Get date range
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const forecasts = await prisma.forecast.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        forecastType: "inventory",
        forecastDate: {
          lte: endDate,
        },
      },
      orderBy: {
        forecastDate: "asc",
      },
    });

    // If we have less than requested days, generate new forecasts
    if (forecasts.length < parseInt(days)) {
      const newForecasts = await aiService.generateInventoryForecast(
        parseInt(restaurantId),
        parseInt(days)
      );

      // Save new forecasts
      for (const forecast of newForecasts) {
        await prisma.forecast.create({
          data: forecast,
        });
      }

      // Fetch updated forecasts
      const updatedForecasts = await prisma.forecast.findMany({
        where: {
          restaurantId: parseInt(restaurantId),
          forecastType: "inventory",
          forecastDate: {
            lte: endDate,
          },
        },
        orderBy: {
          forecastDate: "asc",
        },
      });

      // Set cache
      await setCached(cacheKey, updatedForecasts, CACHE_TTL);

      return res.json(updatedForecasts);
    }

    // Set cache
    await setCached(cacheKey, forecasts, CACHE_TTL);

    res.json(forecasts);
  } catch (error) {
    next(error);
  }
};

exports.getWastePredictions = async (req, res, next) => {
  try {
    const { restaurantId, days = 7 } = req.query;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: true, message: "Restaurant ID is required" });
    }

    // Check if data is in cache
    const cacheKey = `forecast:waste:${restaurantId}:${days}`;
    const cachedData = await getCached(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Get date range
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const forecasts = await prisma.forecast.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        forecastType: "waste",
        forecastDate: {
          lte: endDate,
        },
      },
      orderBy: {
        forecastDate: "asc",
      },
    });

    // If we have less than requested days, generate new forecasts
    if (forecasts.length < parseInt(days)) {
      const newForecasts = await aiService.generateWastePrediction(
        parseInt(restaurantId),
        parseInt(days)
      );

      // Save new forecasts
      for (const forecast of newForecasts) {
        await prisma.forecast.create({
          data: forecast,
        });
      }

      // Fetch updated forecasts
      const updatedForecasts = await prisma.forecast.findMany({
        where: {
          restaurantId: parseInt(restaurantId),
          forecastType: "waste",
          forecastDate: {
            lte: endDate,
          },
        },
        orderBy: {
          forecastDate: "asc",
        },
      });

      // Set cache
      await setCached(cacheKey, updatedForecasts, CACHE_TTL);

      return res.json(updatedForecasts);
    }

    // Set cache
    await setCached(cacheKey, forecasts, CACHE_TTL);

    res.json(forecasts);
  } catch (error) {
    next(error);
  }
};

exports.generateForecast = async (req, res, next) => {
  try {
    const { restaurantId, type, days = 7 } = req.body;

    if (!restaurantId || !type) {
      return res.status(400).json({
        error: true,
        message: "Restaurant ID and forecast type are required",
      });
    }

    let newForecasts;

    // Generate appropriate forecast type
    switch (type) {
      case "sales":
        newForecasts = await aiService.generateSalesForecast(
          parseInt(restaurantId),
          parseInt(days)
        );
        break;
      case "inventory":
        newForecasts = await aiService.generateInventoryForecast(
          parseInt(restaurantId),
          parseInt(days)
        );
        break;
      case "waste":
        newForecasts = await aiService.generateWastePrediction(
          parseInt(restaurantId),
          parseInt(days)
        );
        break;
      default:
        return res.status(400).json({
          error: true,
          message:
            "Invalid forecast type. Must be one of: sales, inventory, waste",
        });
    }

    // Save forecasts to database
    const savedForecasts = [];

    for (const forecast of newForecasts) {
      const saved = await prisma.forecast.create({
        data: forecast,
      });
      savedForecasts.push(saved);
    }

    // Invalidate relevant caches
    const cacheKey = `forecast:${type}:${restaurantId}:${days}`;
    await setCached(cacheKey, null, 0);

    res.status(201).json({
      success: true,
      forecasts: savedForecasts,
    });
  } catch (error) {
    next(error);
  }
};
