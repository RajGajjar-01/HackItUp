const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// Mock data constants
const RESTAURANT_COUNT = 2;
const USERS_PER_RESTAURANT = 3;
const INVENTORY_ITEMS_PER_RESTAURANT = 30;
const RECIPES_PER_RESTAURANT = 15;
const WASTE_RECORDS_PER_RESTAURANT = 20;
const SALES_RECORDS_PER_RESTAURANT = 50;
const MENUS_PER_RESTAURANT = 3;

// Helper function to get random item from array
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Helper function to generate random date within range
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
const getRandomeInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// Helper function to get random float with 2 decimal places
const getRandomFloat = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Seed function
async function main() {
  console.log("Starting database seed...");

  await prisma.menuItems.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.salesData.deleteMany({});
  await prisma.wasteRecord.deleteMany({});
  await prisma.recipeItem.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.restaurant.deleteMany({});

  console.log("Cleared existing data");

  const inventoryCategories = [
    "Meat",
    "Fish",
    "Dairy",
    "Produce",
    "Herbs",
    "Grains",
    "Baking",
    "Canned Goods",
    "Oils",
    "Condiments",
    "Spices",
  ];

  const inventoryItems = [
    { name: "Chicken Breast", category: "Meat", unit: "kg", cost: 8.99 },
    { name: "Ground Beef", category: "Meat", unit: "kg", cost: 7.5 },
    { name: "Salmon Fillet", category: "Fish", unit: "kg", cost: 15.99 },
    { name: "Shrimp", category: "Fish", unit: "kg", cost: 18.5 },
    { name: "Milk", category: "Dairy", unit: "liter", cost: 2.49 },
    { name: "Heavy Cream", category: "Dairy", unit: "liter", cost: 4.99 },
    { name: "Cheddar Cheese", category: "Dairy", unit: "kg", cost: 9.99 },
    { name: "Butter", category: "Dairy", unit: "kg", cost: 7.85 },
    { name: "Tomatoes", category: "Produce", unit: "kg", cost: 3.99 },
    { name: "Lettuce", category: "Produce", unit: "kg", cost: 2.5 },
    { name: "Onions", category: "Produce", unit: "kg", cost: 1.99 },
    { name: "Garlic", category: "Produce", unit: "kg", cost: 5.99 },
    { name: "Bell Peppers", category: "Produce", unit: "kg", cost: 4.5 },
    { name: "Carrots", category: "Produce", unit: "kg", cost: 2.25 },
    { name: "Potatoes", category: "Produce", unit: "kg", cost: 1.79 },
    { name: "Basil", category: "Herbs", unit: "kg", cost: 18.99 },
    { name: "Thyme", category: "Herbs", unit: "kg", cost: 19.99 },
    { name: "Rosemary", category: "Herbs", unit: "kg", cost: 19.99 },
    { name: "Rice", category: "Grains", unit: "kg", cost: 2.99 },
    { name: "Pasta", category: "Grains", unit: "kg", cost: 2.5 },
    { name: "Flour", category: "Baking", unit: "kg", cost: 1.99 },
    { name: "Sugar", category: "Baking", unit: "kg", cost: 2.49 },
    {
      name: "Canned Tomatoes",
      category: "Canned Goods",
      unit: "kg",
      cost: 2.99,
    },
    { name: "Canned Beans", category: "Canned Goods", unit: "kg", cost: 1.99 },
    { name: "Olive Oil", category: "Oils", unit: "liter", cost: 8.99 },
    { name: "Vegetable Oil", category: "Oils", unit: "liter", cost: 3.99 },
    { name: "Soy Sauce", category: "Condiments", unit: "liter", cost: 4.99 },
    { name: "Vinegar", category: "Condiments", unit: "liter", cost: 3.5 },
    { name: "Salt", category: "Spices", unit: "kg", cost: 1.99 },
    { name: "Black Pepper", category: "Spices", unit: "kg", cost: 15.99 },
    { name: "Paprika", category: "Spices", unit: "kg", cost: 18.5 },
    { name: "Cumin", category: "Spices", unit: "kg", cost: 16.99 },
    { name: "Cinnamon", category: "Spices", unit: "kg", cost: 14.99 },
    { name: "Eggs", category: "Dairy", unit: "dozen", cost: 3.99 },
    { name: "Mushrooms", category: "Produce", unit: "kg", cost: 6.99 },
    { name: "Lemons", category: "Produce", unit: "kg", cost: 3.99 },
    { name: "Limes", category: "Produce", unit: "kg", cost: 4.5 },
    { name: "Cilantro", category: "Herbs", unit: "kg", cost: 12.99 },
    { name: "Parsley", category: "Herbs", unit: "kg", cost: 10.99 },
    { name: "Honey", category: "Condiments", unit: "kg", cost: 9.99 },
  ];

  const recipeCategories = [
    "Appetizer",
    "Main Course",
    "Dessert",
    "Side Dish",
    "Soup",
    "Salad",
    "Breakfast",
  ];

  const recipes = [
    { name: "Grilled Chicken Salad", category: "Salad", price: 12.99 },
    { name: "Spaghetti Bolognese", category: "Main Course", price: 14.99 },
    { name: "Vegetable Stir Fry", category: "Main Course", price: 13.5 },
    { name: "Creamy Tomato Soup", category: "Soup", price: 8.99 },
    { name: "Chocolate Cake", category: "Dessert", price: 6.99 },
    { name: "Garlic Bread", category: "Side Dish", price: 4.99 },
    { name: "Caesar Salad", category: "Salad", price: 10.99 },
    { name: "Mushroom Risotto", category: "Main Course", price: 16.99 },
    { name: "Beef Burger", category: "Main Course", price: 12.99 },
    { name: "Cheese Platter", category: "Appetizer", price: 15.99 },
    { name: "Pancakes", category: "Breakfast", price: 9.99 },
    { name: "Salmon with Herbs", category: "Main Course", price: 19.99 },
    { name: "French Fries", category: "Side Dish", price: 5.99 },
    { name: "Vegetable Soup", category: "Soup", price: 7.99 },
    { name: "Tiramisu", category: "Dessert", price: 8.5 },
    { name: "Chicken Wings", category: "Appetizer", price: 11.99 },
    { name: "Eggs Benedict", category: "Breakfast", price: 13.99 },
    { name: "Pasta Carbonara", category: "Main Course", price: 15.5 },
    { name: "Greek Salad", category: "Salad", price: 11.5 },
    { name: "Cheesecake", category: "Dessert", price: 7.99 },
  ];

  const wasteReasons = [
    "Spoiled",
    "Over-produced",
    "Expired",
    "Cooking error",
    "Customer return",
    "Spillage",
    "Contamination",
  ];

  // Menu related data
  const menuTypes = [
    "Regular Menu",
    "Lunch Special",
    "Dinner Special",
    "Weekend Brunch",
    "Holiday Menu",
    "Seasonal Specials",
  ];

  const menuSections = [
    "Appetizers",
    "Soups & Salads",
    "Main Course",
    "Sides",
    "Desserts",
    "Beverages",
    "Breakfast",
    "Chef's Specials",
  ];

  console.log("Creating restaurants and users...");

  // Create restaurants with users and data
  for (let r = 0; r < RESTAURANT_COUNT; r++) {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: `Restaurant ${r + 1}`,
        address: `${Math.floor(Math.random() * 1000) + 1} Main Street, City ${
          r + 1
        }`,
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 900) + 100
        }-${Math.floor(Math.random() * 9000) + 1000}`,
      },
    });

    console.log(`Created restaurant: ${restaurant.name}`);

    // Create users for this restaurant
    const users = [];
    const roles = ["owner", "manager", "staff"];

    for (let u = 0; u < USERS_PER_RESTAURANT; u++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);

      const user = await prisma.user.create({
        data: {
          name: `User ${r * USERS_PER_RESTAURANT + u + 1}`,
          email: `user${r * USERS_PER_RESTAURANT + u + 1}@example.com`,
          password: hashedPassword,
          role: roles[u % roles.length],
          restaurantId: restaurant.id,
        },
      });

      users.push(user);
    }

    console.log(`Created ${users.length} users for ${restaurant.name}`);

    // Create inventory items for this restaurant
    const inventoryItemsData = [];
    const today = new Date();

    // Function to create unique inventory items for this restaurant
    const createInventoryItem = async (item, index) => {
      // Calculate expiry date: some items will be expired, some close to expiry, some far from expiry
      let expiryDate = null;
      const randomFactor = Math.random();

      if (randomFactor > 0.3) {
        // 70% of items have expiry dates
        if (randomFactor < 0.4) {
          // 10% expired
          expiryDate = new Date(today);
          expiryDate.setDate(
            today.getDate() - Math.floor(Math.random() * 10) - 1
          );
        } else if (randomFactor < 0.6) {
          // 20% close to expiry
          expiryDate = new Date(today);
          expiryDate.setDate(
            today.getDate() + Math.floor(Math.random() * 7) + 1
          );
        } else {
          // 40% far from expiry
          expiryDate = new Date(today);
          expiryDate.setDate(
            today.getDate() + Math.floor(Math.random() * 30) + 7
          );
        }
      }

      // Calculate purchase date (between 1-60 days ago)
      const purchaseDate = new Date(today);
      purchaseDate.setDate(
        today.getDate() - Math.floor(Math.random() * 60) - 1
      );

      // Set flag based on expiry date (true if expired or close to expiry)
      const flag = expiryDate
        ? expiryDate < today ||
          (expiryDate > today &&
            expiryDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
        : false;

      const inventoryItem = await prisma.inventoryItem.create({
        data: {
          name: item.name,
          category: item.category,
          quantity: getRandomFloat(0.5, 20),
          minQuantity: getRandomeInt(1, 10),
          unit: item.unit,
          flag: flag,
          cost: item.cost,
          purchaseDate,
          expiryDate,
          restaurantId: restaurant.id,
        },
      });

      return inventoryItem;
    };

    // Create unique inventory items
    const createdInventoryItems = [];
    const itemsToCreate = Math.min(
      inventoryItems.length,
      INVENTORY_ITEMS_PER_RESTAURANT
    );

    for (let i = 0; i < itemsToCreate; i++) {
      const item = inventoryItems[i];
      const inventoryItem = await createInventoryItem(item, i);
      createdInventoryItems.push(inventoryItem);
    }

    console.log(
      `Created ${createdInventoryItems.length} inventory items for ${restaurant.name}`
    );

    // Create recipes for this restaurant
    const createdRecipes = [];
    const recipesToCreate = Math.min(recipes.length, RECIPES_PER_RESTAURANT);

    for (let i = 0; i < recipesToCreate; i++) {
      const recipe = recipes[i];
      const isSpecial = Math.random() > 0.8; // 20% are specials

      const createdRecipe = await prisma.recipe.create({
        data: {
          name: recipe.name,
          description: `Delicious ${recipe.name.toLowerCase()} made with fresh ingredients.`,
          category: recipe.category,
          price: recipe.price,
          isSpecial,
          restaurantId: restaurant.id,
        },
      });

      // Add 2-5 random ingredients to the recipe
      const ingredientCount = Math.floor(Math.random() * 4) + 2;
      const ingredientItems = [...createdInventoryItems]; // Make a copy

      for (let j = 0; j < ingredientCount; j++) {
        if (ingredientItems.length === 0) break;

        // Get a random inventory item
        const randomIndex = Math.floor(Math.random() * ingredientItems.length);
        const inventoryItem = ingredientItems.splice(randomIndex, 1)[0];

        // Create recipe item connecting recipe and inventory item
        await prisma.recipeItem.create({
          data: {
            recipeId: createdRecipe.id,
            inventoryItemId: inventoryItem.id,
            quantity: getRandomFloat(0.1, 2),
            unit: inventoryItem.unit,
          },
        });
      }

      createdRecipes.push(createdRecipe);
    }

    console.log(
      `Created ${createdRecipes.length} recipes for ${restaurant.name}`
    );

    // Create waste records
    for (let i = 0; i < WASTE_RECORDS_PER_RESTAURANT; i++) {
      // Select a random inventory item
      const inventoryItem = getRandomItem(createdInventoryItems);

      // Get a random date within the last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);
      const wasteDate = getRandomDate(ninetyDaysAgo, today);

      await prisma.wasteRecord.create({
        data: {
          inventoryItemId: inventoryItem.id,
          quantity: getRandomFloat(0.1, 5),
          reason: getRandomItem(wasteReasons),
          restaurantId: restaurant.id,
          createdAt: wasteDate,
          updatedAt: wasteDate,
        },
      });
    }

    console.log(
      `Created ${WASTE_RECORDS_PER_RESTAURANT} waste records for ${restaurant.name}`
    );

    // Create sales records
    for (let i = 0; i < SALES_RECORDS_PER_RESTAURANT; i++) {
      // Select a random recipe
      const recipe = getRandomItem(createdRecipes);

      // Get a random date within the last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);
      const saleDate = getRandomDate(ninetyDaysAgo, today);

      // Calculate random quantity and revenue
      const quantitySold = Math.floor(Math.random() * 10) + 1;
      const revenue = Number((recipe.price * quantitySold).toFixed(2));

      await prisma.salesData.create({
        data: {
          recipeId: recipe.id,
          quantitySold,
          revenue,
          date: saleDate,
          restaurantId: restaurant.id,
          createdAt: saleDate,
          updatedAt: saleDate,
        },
      });
    }

    console.log(
      `Created ${SALES_RECORDS_PER_RESTAURANT} sales records for ${restaurant.name}`
    );

    // Create menus for this restaurant
    for (let i = 0; i < MENUS_PER_RESTAURANT; i++) {
      const menuName = getRandomItem(menuTypes);
      const isActive = Math.random() > 0.3; // 70% active

      // Set date range for menu
      let startDate = new Date();
      startDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

      let endDate = null;
      if (Math.random() > 0.5) {
        // 50% have end dates
        endDate = new Date();
        endDate.setDate(
          startDate.getDate() + Math.floor(Math.random() * 90) + 30
        );
      }

      const menu = await prisma.menu.create({
        data: {
          name: `${menuName} ${i + 1}`,
          description: `${menuName} featuring our best dishes`,
          startDate,
          endDate,
          isActive,
          restaurantId: restaurant.id,
        },
      });

      // Add menu items - assign recipes to this menu
      // Shuffle recipes to get a random selection
      const shuffledRecipes = [...createdRecipes].sort(
        () => 0.5 - Math.random()
      );

      // Take a subset of recipes for this menu (3-8 recipes)
      const menuItemCount = Math.floor(Math.random() * 6) + 3;
      const menuRecipes = shuffledRecipes.slice(0, menuItemCount);

      // Create menu items with sections
      for (let j = 0; j < menuRecipes.length; j++) {
        const recipe = menuRecipes[j];
        const section = getRandomItem(menuSections);

        await prisma.menuItems.create({
          data: {
            menuId: menu.id,
            recipeId: recipe.id,
            section,
            order: j + 1,
          },
        });
      }

      console.log(`Created menu "${menu.name}" with ${menuItemCount} items`);
    }
  }

  console.log("Database seed completed successfully");
}

// Execute seed function
main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma connection
    await prisma.$disconnect();
  });
