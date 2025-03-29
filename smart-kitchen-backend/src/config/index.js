require("dotenv").config();

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
    apiPrefix: "/api",
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
    logQueries: process.env.NODE_ENV === "development",
  },

  // Redis cache configuration
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    ttl: {
      default: 60 * 10, // 10 minutes
      short: 60, // 1 minute
      medium: 60 * 30, // 30 minutes
      long: 60 * 60 * 3, // 3 hours
    },
  },

  // AI service configuration
  aiService: {
    baseUrl: process.env.AI_SERVICE_BASE_URL || "http://localhost:5000",
    timeout: 30000, // 30 seconds
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "7d",
  },
};
