/**
 * Middleware for validating inventory item requests
 */
exports.validateInventory = (req, res, next) => {
  const { name, category, quantity, unit, minThreshold, restaurantId } =
    req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (!category || category.trim() === "") {
    errors.push("Category is required");
  }

  if (quantity === undefined || isNaN(quantity) || quantity < 0) {
    errors.push("Valid quantity is required");
  }

  if (!unit || unit.trim() === "") {
    errors.push("Unit is required");
  }

  if (minThreshold === undefined || isNaN(minThreshold) || minThreshold < 0) {
    errors.push("Valid minimum threshold is required");
  }

  if (!restaurantId || isNaN(parseInt(restaurantId))) {
    errors.push("Valid restaurant ID is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: true,
      message: "Validation failed",
      details: errors,
    });
  }

  next();
};

/**
 * Middleware for validating menu item requests
 */
exports.validateMenuItem = (req, res, next) => {
  const { name, price, category, restaurantId, ingredients } = req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (price === undefined || isNaN(price) || price < 0) {
    errors.push("Valid price is required");
  }

  if (!category || category.trim() === "") {
    errors.push("Category is required");
  }

  if (!restaurantId || isNaN(parseInt(restaurantId))) {
    errors.push("Valid restaurant ID is required");
  }

  // Validate ingredients if provided
  if (ingredients && Array.isArray(ingredients)) {
    ingredients.forEach((ing, index) => {
      if (!ing.inventoryId || isNaN(parseInt(ing.inventoryId))) {
        errors.push(
          `Ingredient at index ${index}: Valid inventory ID is required`
        );
      }

      if (
        ing.quantity === undefined ||
        isNaN(ing.quantity) ||
        ing.quantity <= 0
      ) {
        errors.push(`Ingredient at index ${index}: Valid quantity is required`);
      }

      if (!ing.unit || ing.unit.trim() === "") {
        errors.push(`Ingredient at index ${index}: Unit is required`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: true,
      message: "Validation failed",
      details: errors,
    });
  }

  next();
};
