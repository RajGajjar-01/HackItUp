const express = require("express");
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAvailableRecipes,
} = require("../controllers/recipe.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication middleware to all recipe routes
// router.use(authenticate);

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes for a restaurant
 * @access  Private
 */
router.get("/", getAllRecipes);

/**
 * @route   GET /api/recipes/available
 * @desc    Get recipes with all ingredients in stock
 * @access  Private
 */
router.get("/available", getAvailableRecipes);

/**
 * @route   GET /api/recipes/:id
 * @desc    Get a single recipe by ID
 * @access  Private
 */
router.get("/:id", getRecipeById);

/**
 * @route   POST /api/recipes
 * @desc    Create a new recipe
 * @access  Private
 */
router.post("/", createRecipe);

/**
 * @route   PUT /api/recipes/:id
 * @desc    Update an existing recipe
 * @access  Private
 */
router.put("/:id", updateRecipe);

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Delete a recipe
 * @access  Private
 */
router.delete("/:id", deleteRecipe);

module.exports = router;
