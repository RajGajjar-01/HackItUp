const axios = require("axios");

/**
 * Utility class for communicating with the FastAPI AI services
 */
class AIService {
  constructor() {
    this.baseURL = process.env.FASTAPI_BASE_URL;
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout for AI processing
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Handle errors from AI service calls
   */
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with an error
      console.error("AI Service error response:", error.response.data);
      return {
        error: true,
        message: error.response.data.detail || "Error from AI service",
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("AI Service no response:", error.request);
      return {
        error: true,
        message: "No response from AI service - service may be offline",
        status: 503,
      };
    } else {
      // Something else happened in setting up the request
      console.error("AI Service request setup error:", error.message);
      return {
        error: true,
        message: "Error setting up AI service request",
        status: 500,
      };
    }
  }

  /**
   * Process image for inventory detection
   * @param {string} imageBase64 - Base64 encoded image
   * @param {string} restaurantId - Restaurant ID for context
   */
  async processInventoryImage(imageBase64, restaurantId) {
    try {
      const response = await this.axios.post(process.env.VISION_API_ENDPOINT, {
        image: imageBase64,
        restaurant_id: restaurantId,
        task: "inventory_detection",
      });

      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Detect food spoilage from image
   * @param {string} imageBase64 - Base64 encoded image
   * @param {string} inventoryItemId - ID of the inventory item being checked
   */
  async detectFoodSpoilage(imageBase64, inventoryItemId) {
    try {
      const response = await this.axios.post(process.env.VISION_API_ENDPOINT, {
        image: imageBase64,
        inventory_item_id: inventoryItemId,
        task: "spoilage_detection",
      });

      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get sales and inventory demand predictions
   * @param {string} restaurantId - Restaurant ID
   * @param {number} days - Number of days to forecast
   */
  async getPredictions(restaurantId, days = 7) {
    try {
      const response = await this.axios.post(
        process.env.PREDICTION_API_ENDPOINT,
        {
          restaurant_id: restaurantId,
          days: days,
        }
      );

      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generate recipe suggestions based on current inventory
   * @param {string} restaurantId - Restaurant ID
   * @param {Array} expiringItems - Array of expiring inventory item IDs to prioritize
   */
  async generateRecipes(restaurantId, expiringItems = []) {
    try {
      const response = await this.axios.post(
        process.env.RECIPE_GENERATION_API_ENDPOINT,
        {
          restaurant_id: restaurantId,
          expiring_items: expiringItems,
        }
      );

      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Analyze waste from image
   * @param {string} imageBase64 - Base64 encoded image of waste
   * @param {string} restaurantId - Restaurant ID
   */
  async analyzeWaste(imageBase64, restaurantId) {
    try {
      const response = await this.axios.post(
        process.env.WASTE_ANALYSIS_API_ENDPOINT,
        {
          image: imageBase64,
          restaurant_id: restaurantId,
        }
      );

      return {
        error: false,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

module.exports = new AIService();
