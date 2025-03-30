const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./lib/prisma");
const suggestionRoutes = require("./routes/suggestion.js");
// Import routes
const authRoutes = require("./routes/auth.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const recipeRoutes = require("./routes/recipe.routes");
const wasteRoutes = require("./routes/waste.routes");
const salesRoutes = require("./routes/sales.routes");
const aiServiceRoutes = require("./routes/ai-service.routes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/ai", aiServiceRoutes);
app.use("/api/suggestions", suggestionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Smart Kitchen API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
