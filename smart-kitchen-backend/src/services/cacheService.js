const redis = require("redis");
const { promisify } = require("util");

// Initialize Redis client
const redisURL = process.env.REDIS_URL || "redis://localhost:6379";
const client = redis.createClient(redisURL);

// Handle Redis connection errors
client.on("error", (err) => {
  console.error("Redis error:", err);
});

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<object|null>} Cached data or null
 */
const getCached = async (key) => {
  try {
    const data = await getAsync(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
};

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {object} data - Data to cache
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} Success status
 */
const setCached = async (key, data, ttl) => {
  try {
    if (data === null) {
      await delAsync(key);
      return true;
    }

    const value = JSON.stringify(data);
    if (ttl) {
      await setAsync(key, value, "EX", ttl);
    } else {
      await setAsync(key, value);
    }
    return true;
  } catch (error) {
    console.error("Cache set error:", error);
    return false;
  }
};

module.exports = {
  cache: client,
  getCached,
  setCached,
};
