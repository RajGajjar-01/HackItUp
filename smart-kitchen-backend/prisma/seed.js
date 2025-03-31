// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcrypt");

// const prisma = new PrismaClient();

// // Mock data constants
// const RESTAURANT_COUNT = 2;
// const USERS_PER_RESTAURANT = 3;
// const INVENTORY_ITEMS_PER_RESTAURANT = 30;
// const RECIPES_PER_RESTAURANT = 15;
// const WASTE_RECORDS_PER_RESTAURANT = 20;
// const SALES_RECORDS_PER_RESTAURANT = 50;
// const MENUS_PER_RESTAURANT = 3;

// // Helper function to get random item from array
// const getRandomItem = (array) =>
//   array[Math.floor(Math.random() * array.length)];

// // Helper function to generate random date within range
// const getRandomDate = (start, end) => {
//   return new Date(
//     start.getTime() + Math.random() * (end.getTime() - start.getTime())
//   );
// };
// const getRandomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };
// // Helper function to get random float with 2 decimal places
// const getRandomFloat = (min, max) => {
//   return parseFloat((Math.random() * (max - min) + min).toFixed(2));
// };

// // Seed function
// async function main() {
//   console.log("Starting database seed for Indian restaurants...");

//   await prisma.menuItems.deleteMany({});
//   await prisma.menu.deleteMany({});
//   await prisma.salesData.deleteMany({});
//   await prisma.wasteRecord.deleteMany({});
//   await prisma.recipeItem.deleteMany({});
//   await prisma.recipe.deleteMany({});
//   await prisma.inventoryItem.deleteMany({});
//   await prisma.user.deleteMany({});
//   await prisma.restaurant.deleteMany({});

//   console.log("Cleared existing data");

//   const inventoryCategories = [
//     "Spices",
//     "Pulses",
//     "Grains",
//     "Dairy",
//     "Vegetables",
//     "Fruits",
//     "Oils",
//     "Flours",
//     "Meat",
//     "Seafood",
//     "Condiments",
//     "Dry Fruits",
//     "Herbs",
//   ];

//   const inventoryItems = [
//     { name: "Basmati Rice", category: "Grains", unit: "kg", cost: 120 },
//     { name: "Toor Dal", category: "Pulses", unit: "kg", cost: 140 },
//     { name: "Chana Dal", category: "Pulses", unit: "kg", cost: 110 },
//     { name: "Urad Dal", category: "Pulses", unit: "kg", cost: 130 },
//     { name: "Moong Dal", category: "Pulses", unit: "kg", cost: 125 },
//     { name: "Turmeric Powder", category: "Spices", unit: "kg", cost: 280 },
//     { name: "Red Chilli Powder", category: "Spices", unit: "kg", cost: 320 },
//     { name: "Garam Masala", category: "Spices", unit: "kg", cost: 450 },
//     { name: "Cumin Seeds", category: "Spices", unit: "kg", cost: 380 },
//     { name: "Mustard Seeds", category: "Spices", unit: "kg", cost: 290 },
//     { name: "Coriander Powder", category: "Spices", unit: "kg", cost: 260 },
//     { name: "Cardamom", category: "Spices", unit: "kg", cost: 1200 },
//     { name: "Cloves", category: "Spices", unit: "kg", cost: 950 },
//     { name: "Cinnamon", category: "Spices", unit: "kg", cost: 850 },
//     { name: "Black Pepper", category: "Spices", unit: "kg", cost: 650 },
//     { name: "Paneer", category: "Dairy", unit: "kg", cost: 320 },
//     { name: "Milk", category: "Dairy", unit: "liter", cost: 60 },
//     { name: "Ghee", category: "Dairy", unit: "kg", cost: 550 },
//     { name: "Curd", category: "Dairy", unit: "kg", cost: 80 },
//     { name: "Cream", category: "Dairy", unit: "liter", cost: 190 },
//     { name: "Potatoes", category: "Vegetables", unit: "kg", cost: 40 },
//     { name: "Onions", category: "Vegetables", unit: "kg", cost: 35 },
//     { name: "Tomatoes", category: "Vegetables", unit: "kg", cost: 50 },
//     { name: "Ginger", category: "Vegetables", unit: "kg", cost: 120 },
//     { name: "Garlic", category: "Vegetables", unit: "kg", cost: 150 },
//     { name: "Cauliflower", category: "Vegetables", unit: "kg", cost: 60 },
//     { name: "Green Peas", category: "Vegetables", unit: "kg", cost: 80 },
//     { name: "Spinach", category: "Vegetables", unit: "kg", cost: 40 },
//     { name: "Mustard Oil", category: "Oils", unit: "liter", cost: 140 },
//     { name: "Sunflower Oil", category: "Oils", unit: "liter", cost: 120 },
//     { name: "Atta (Wheat Flour)", category: "Flours", unit: "kg", cost: 45 },
//     {
//       name: "Maida (All-purpose Flour)",
//       category: "Flours",
//       unit: "kg",
//       cost: 50,
//     },
//     { name: "Besan (Gram Flour)", category: "Flours", unit: "kg", cost: 90 },
//     { name: "Chicken", category: "Meat", unit: "kg", cost: 220 },
//     { name: "Mutton", category: "Meat", unit: "kg", cost: 650 },
//     { name: "Prawns", category: "Seafood", unit: "kg", cost: 550 },
//     { name: "Fish (Rohu)", category: "Seafood", unit: "kg", cost: 320 },
//     { name: "Tamarind", category: "Condiments", unit: "kg", cost: 180 },
//     { name: "Jaggery", category: "Condiments", unit: "kg", cost: 90 },
//     { name: "Cashews", category: "Dry Fruits", unit: "kg", cost: 750 },
//     { name: "Raisins", category: "Dry Fruits", unit: "kg", cost: 450 },
//     { name: "Almonds", category: "Dry Fruits", unit: "kg", cost: 850 },
//     { name: "Coriander Leaves", category: "Herbs", unit: "kg", cost: 80 },
//     { name: "Mint Leaves", category: "Herbs", unit: "kg", cost: 100 },
//     { name: "Curry Leaves", category: "Herbs", unit: "kg", cost: 120 },
//   ];

//   const recipeCategories = [
//     "Starters",
//     "Main Course",
//     "Bread",
//     "Rice",
//     "Desserts",
//     "Thali",
//     "Street Food",
//     "Beverages",
//     "Chaat",
//   ];

//   const recipes = [
//     { name: "Butter Chicken", category: "Main Course", price: 350 },
//     { name: "Palak Paneer", category: "Main Course", price: 280 },
//     { name: "Dal Makhani", category: "Main Course", price: 240 },
//     { name: "Chhole Bhature", category: "Main Course", price: 180 },
//     { name: "Biryani", category: "Rice", price: 320 },
//     { name: "Jeera Rice", category: "Rice", price: 150 },
//     { name: "Naan", category: "Bread", price: 50 },
//     { name: "Roti", category: "Bread", price: 20 },
//     { name: "Gulab Jamun", category: "Desserts", price: 100 },
//     { name: "Rasmalai", category: "Desserts", price: 120 },
//     { name: "Paneer Tikka", category: "Starters", price: 280 },
//     { name: "Samosa", category: "Starters", price: 40 },
//     { name: "Rajma Chawal", category: "Main Course", price: 190 },
//     { name: "Malai Kofta", category: "Main Course", price: 290 },
//     { name: "Aloo Paratha", category: "Bread", price: 60 },
//     { name: "Pav Bhaji", category: "Street Food", price: 150 },
//     { name: "Masala Dosa", category: "Street Food", price: 120 },
//     { name: "Idli Sambar", category: "Street Food", price: 100 },
//     { name: "Vada Pav", category: "Street Food", price: 60 },
//     { name: "Bhel Puri", category: "Chaat", price: 80 },
//     { name: "Pani Puri", category: "Chaat", price: 70 },
//     { name: "Pindi Chole", category: "Main Course", price: 220 },
//     { name: "Kadai Paneer", category: "Main Course", price: 290 },
//     { name: "South Indian Thali", category: "Thali", price: 350 },
//     { name: "North Indian Thali", category: "Thali", price: 380 },
//     { name: "Masala Chai", category: "Beverages", price: 40 },
//     { name: "Lassi", category: "Beverages", price: 80 },
//     { name: "Mango Lassi", category: "Beverages", price: 90 },
//   ];

//   const wasteReasons = [
//     "Spoiled",
//     "Over-produced",
//     "Expired",
//     "Cooking error",
//     "Customer return",
//     "Spillage",
//     "Contamination",
//     "Power outage spoilage",
//     "Improper storage",
//   ];

//   // Menu related data
//   const menuTypes = [
//     "Regular Menu",
//     "Lunch Special",
//     "Dinner Special",
//     "Weekend Special",
//     "Festival Menu",
//     "Seasonal Menu",
//     "Monsoon Special",
//     "Summer Special",
//     "Winter Special",
//   ];

//   const menuSections = [
//     "Starters",
//     "Soups",
//     "Chaats",
//     "Main Course",
//     "Breads",
//     "Rice & Biryani",
//     "Desserts",
//     "Beverages",
//     "Thalis",
//     "Street Food",
//     "South Indian Specials",
//     "North Indian Specials",
//     "Chef's Specials",
//   ];

//   // Indian cities and areas
//   const indianCities = [
//     "Mumbai",
//     "Delhi",
//     "Bangalore",
//     "Hyderabad",
//     "Chennai",
//     "Kolkata",
//     "Pune",
//     "Jaipur",
//     "Ahmedabad",
//     "Lucknow",
//   ];

//   const areas = [
//     "Connaught Place",
//     "Banjara Hills",
//     "Koramangala",
//     "Juhu",
//     "Park Street",
//     "MG Road",
//     "Civil Lines",
//     "Malviya Nagar",
//     "Aundh",
//     "Anna Nagar",
//     "Indiranagar",
//     "Bandra",
//     "Hauz Khas",
//     "Panchkula",
//     "Defence Colony",
//   ];

//   console.log("Creating Indian restaurants and users...");

//   // Create restaurants with users and data
//   for (let r = 0; r < RESTAURANT_COUNT; r++) {
//     // Select random city and area
//     const city = getRandomItem(indianCities);
//     const area = getRandomItem(areas);

//     // Indian restaurant names
//     const restaurantNames = [
//       "Spice Junction",
//       "Tandoor Palace",
//       "Flavors of India",
//       "Curry Leaf",
//       "Masala House",
//       "Taj Mahal Kitchen",
//       "Royal Rasoi",
//       "Desi Dhaba",
//       "Chennai Express",
//       "Punjab Grill",
//       "Bombay Brasserie",
//     ];

//     const restaurantName = restaurantNames[r % restaurantNames.length];

//     const restaurant = await prisma.restaurant.create({
//       data: {
//         name: restaurantName,
//         address: `${Math.floor(Math.random() * 100) + 1}, ${area}, ${city}`,
//         phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
//       },
//     });

//     console.log(`Created restaurant: ${restaurant.name} in ${city}`);

//     // Create users for this restaurant
//     const users = [];
//     const roles = ["owner", "manager", "staff"];

//     // Indian names
//     const indianNames = [
//       "Rajesh Kumar",
//       "Priya Singh",
//       "Amit Sharma",
//       "Deepika Patel",
//       "Vikram Mehta",
//       "Ananya Gupta",
//       "Suresh Reddy",
//       "Neha Verma",
//       "Rohan Joshi",
//       "Meera Kapoor",
//     ];

//     for (let u = 0; u < USERS_PER_RESTAURANT; u++) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash("password123", salt);

//       const userName = indianNames[r * USERS_PER_RESTAURANT + u];

//       const user = await prisma.user.create({
//         data: {
//           name: userName || `User ${r * USERS_PER_RESTAURANT + u + 1}`,
//           email: `user${r * USERS_PER_RESTAURANT + u + 1}@example.com`,
//           password: hashedPassword,
//           role: roles[u % roles.length],
//           restaurantId: restaurant.id,
//         },
//       });

//       users.push(user);
//     }

//     console.log(`Created ${users.length} users for ${restaurant.name}`);

//     // Create inventory items for this restaurant
//     const inventoryItemsData = [];
//     const today = new Date();

//     // Function to create unique inventory items for this restaurant
//     const createInventoryItem = async (item, index) => {
//       // Calculate expiry date: some items will be expired, some close to expiry, some far from expiry
//       let expiryDate = null;
//       const randomFactor = Math.random();

//       if (randomFactor > 0.3) {
//         // 70% of items have expiry dates
//         if (randomFactor < 0.4) {
//           // 10% expired
//           expiryDate = new Date(today);
//           expiryDate.setDate(
//             today.getDate() - Math.floor(Math.random() * 10) - 1
//           );
//         } else if (randomFactor < 0.6) {
//           // 20% close to expiry
//           expiryDate = new Date(today);
//           expiryDate.setDate(
//             today.getDate() + Math.floor(Math.random() * 7) + 1
//           );
//         } else {
//           // 40% far from expiry
//           expiryDate = new Date(today);
//           expiryDate.setDate(
//             today.getDate() + Math.floor(Math.random() * 30) + 7
//           );
//         }
//       }

//       // Calculate purchase date (between 1-60 days ago)
//       const purchaseDate = new Date(today);
//       purchaseDate.setDate(
//         today.getDate() - Math.floor(Math.random() * 60) - 1
//       );

//       // Set flag based on expiry date (true if expired or close to expiry)
//       const flag = expiryDate
//         ? expiryDate < today ||
//           (expiryDate > today &&
//             expiryDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
//         : false;

//       const inventoryItem = await prisma.inventoryItem.create({
//         data: {
//           name: item.name,
//           category: item.category,
//           quantity: getRandomFloat(0.5, 20),
//           minQuantity: getRandomInt(1, 10),
//           unit: item.unit,
//           flag: flag,
//           cost: item.cost,
//           purchaseDate,
//           expiryDate,
//           restaurantId: restaurant.id,
//         },
//       });

//       return inventoryItem;
//     };

//     // Create unique inventory items
//     const createdInventoryItems = [];
//     const itemsToCreate = Math.min(
//       inventoryItems.length,
//       INVENTORY_ITEMS_PER_RESTAURANT
//     );

//     for (let i = 0; i < itemsToCreate; i++) {
//       const item = inventoryItems[i];
//       const inventoryItem = await createInventoryItem(item, i);
//       createdInventoryItems.push(inventoryItem);
//     }

//     console.log(
//       `Created ${createdInventoryItems.length} inventory items for ${restaurant.name}`
//     );

//     // Create recipes for this restaurant
//     const createdRecipes = [];
//     const recipesToCreate = Math.min(recipes.length, RECIPES_PER_RESTAURANT);

//     for (let i = 0; i < recipesToCreate; i++) {
//       const recipe = recipes[i];
//       const isSpecial = Math.random() > 0.8; // 20% are specials

//       const createdRecipe = await prisma.recipe.create({
//         data: {
//           name: recipe.name,
//           description: `Authentic ${recipe.name.toLowerCase()} prepared with traditional spices and fresh ingredients.`,
//           category: recipe.category,
//           price: recipe.price,
//           isSpecial,
//           restaurantId: restaurant.id,
//         },
//       });

//       // Add 2-5 random ingredients to the recipe
//       const ingredientCount = Math.floor(Math.random() * 4) + 2;
//       const ingredientItems = [...createdInventoryItems]; // Make a copy

//       for (let j = 0; j < ingredientCount; j++) {
//         if (ingredientItems.length === 0) break;

//         // Get a random inventory item
//         const randomIndex = Math.floor(Math.random() * ingredientItems.length);
//         const inventoryItem = ingredientItems.splice(randomIndex, 1)[0];

//         // Create recipe item connecting recipe and inventory item
//         await prisma.recipeItem.create({
//           data: {
//             recipeId: createdRecipe.id,
//             inventoryItemId: inventoryItem.id,
//             quantity: getRandomFloat(0.1, 2),
//             unit: inventoryItem.unit,
//           },
//         });
//       }

//       createdRecipes.push(createdRecipe);
//     }

//     console.log(
//       `Created ${createdRecipes.length} recipes for ${restaurant.name}`
//     );

//     // Create waste records
//     for (let i = 0; i < WASTE_RECORDS_PER_RESTAURANT; i++) {
//       // Select a random inventory item
//       const inventoryItem = getRandomItem(createdInventoryItems);

//       // Get a random date within the last 90 days
//       const ninetyDaysAgo = new Date();
//       ninetyDaysAgo.setDate(today.getDate() - 90);
//       const wasteDate = getRandomDate(ninetyDaysAgo, today);

//       await prisma.wasteRecord.create({
//         data: {
//           inventoryItemId: inventoryItem.id,
//           quantity: getRandomFloat(0.1, 5),
//           reason: getRandomItem(wasteReasons),
//           restaurantId: restaurant.id,
//           createdAt: wasteDate,
//           updatedAt: wasteDate,
//         },
//       });
//     }

//     console.log(
//       `Created ${WASTE_RECORDS_PER_RESTAURANT} waste records for ${restaurant.name}`
//     );

//     // Create sales records
//     for (let i = 0; i < SALES_RECORDS_PER_RESTAURANT; i++) {
//       // Select a random recipe
//       const recipe = getRandomItem(createdRecipes);

//       // Get a random date within the last 90 days
//       const ninetyDaysAgo = new Date();
//       ninetyDaysAgo.setDate(today.getDate() - 90);
//       const saleDate = getRandomDate(ninetyDaysAgo, today);

//       // Calculate random quantity and revenue
//       const quantitySold = Math.floor(Math.random() * 10) + 1;
//       const revenue = Number((recipe.price * quantitySold).toFixed(2));

//       await prisma.salesData.create({
//         data: {
//           recipeId: recipe.id,
//           quantitySold,
//           revenue,
//           date: saleDate,
//           restaurantId: restaurant.id,
//           createdAt: saleDate,
//           updatedAt: saleDate,
//         },
//       });
//     }

//     console.log(
//       `Created ${SALES_RECORDS_PER_RESTAURANT} sales records for ${restaurant.name}`
//     );

//     // Create menus for this restaurant
//     for (let i = 0; i < MENUS_PER_RESTAURANT; i++) {
//       const menuName = getRandomItem(menuTypes);
//       const isActive = Math.random() > 0.3; // 70% active

//       // Set date range for menu
//       let startDate = new Date();
//       startDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

//       let endDate = null;
//       if (Math.random() > 0.5) {
//         // 50% have end dates
//         endDate = new Date();
//         endDate.setDate(
//           startDate.getDate() + Math.floor(Math.random() * 90) + 30
//         );
//       }

//       // Create special festival menus for Indian festivals
//       const festivals = [
//         "Diwali",
//         "Holi",
//         "Navratri",
//         "Durga Puja",
//         "Independence Day",
//         "Republic Day",
//       ];

//       const festivalName =
//         Math.random() > 0.7 ? ` - ${getRandomItem(festivals)} Special` : "";

//       const menu = await prisma.menu.create({
//         data: {
//           name: `${menuName}${festivalName}`,
//           description: `${menuName} featuring our authentic dishes and chef's specials`,
//           startDate,
//           endDate,
//           isActive,
//           restaurantId: restaurant.id,
//         },
//       });

//       // Add menu items - assign recipes to this menu
//       // Shuffle recipes to get a random selection
//       const shuffledRecipes = [...createdRecipes].sort(
//         () => 0.5 - Math.random()
//       );

//       // Take a subset of recipes for this menu (3-8 recipes)
//       const menuItemCount = Math.floor(Math.random() * 6) + 3;
//       const menuRecipes = shuffledRecipes.slice(0, menuItemCount);

//       // Create menu items with sections
//       for (let j = 0; j < menuRecipes.length; j++) {
//         const recipe = menuRecipes[j];
//         const section = getRandomItem(menuSections);

//         await prisma.menuItems.create({
//           data: {
//             menuId: menu.id,
//             recipeId: recipe.id,
//             section,
//             order: j + 1,
//           },
//         });
//       }

//       console.log(`Created menu "${menu.name}" with ${menuItemCount} items`);
//     }
//   }

//   console.log("Database seed for Indian restaurants completed successfully");
// }

// main()
//   .catch((e) => {
//     console.error("Error during seeding:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     // Close Prisma connection
//     await prisma.$disconnect();
//   });
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
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// Helper function to get random float with 2 decimal places
const getRandomFloat = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Seed function
async function main() {
  console.log("Starting database seed for Fruit & Juice restaurants...");

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
    "Fresh Fruits",
    "Frozen Fruits",
    "Vegetables",
    "Dairy",
    "Sweeteners",
    "Herbs",
    "Nuts & Seeds",
    "Superfoods",
    "Supplements",
    "Base Liquids",
    "Ice & Frozen",
    "Toppings",
    "Garnishes",
  ];

  const inventoryItems = [
    // Fresh Fruits
    { name: "Apples", category: "Fresh Fruits", unit: "kg", cost: 150 },
    { name: "Oranges", category: "Fresh Fruits", unit: "kg", cost: 120 },
    { name: "Bananas", category: "Fresh Fruits", unit: "kg", cost: 80 },
    { name: "Strawberries", category: "Fresh Fruits", unit: "kg", cost: 250 },
    { name: "Blueberries", category: "Fresh Fruits", unit: "kg", cost: 450 },
    { name: "Mangoes", category: "Fresh Fruits", unit: "kg", cost: 200 },
    { name: "Watermelon", category: "Fresh Fruits", unit: "kg", cost: 60 },
    { name: "Pineapple", category: "Fresh Fruits", unit: "kg", cost: 100 },
    { name: "Kiwi", category: "Fresh Fruits", unit: "kg", cost: 300 },
    { name: "Pomegranate", category: "Fresh Fruits", unit: "kg", cost: 220 },
    { name: "Grapes", category: "Fresh Fruits", unit: "kg", cost: 180 },
    { name: "Papaya", category: "Fresh Fruits", unit: "kg", cost: 90 },

    // Frozen Fruits
    {
      name: "Frozen Berries Mix",
      category: "Frozen Fruits",
      unit: "kg",
      cost: 280,
    },
    {
      name: "Frozen Mango Chunks",
      category: "Frozen Fruits",
      unit: "kg",
      cost: 220,
    },
    {
      name: "Frozen Pineapple",
      category: "Frozen Fruits",
      unit: "kg",
      cost: 180,
    },

    // Vegetables
    { name: "Spinach", category: "Vegetables", unit: "kg", cost: 120 },
    { name: "Kale", category: "Vegetables", unit: "kg", cost: 150 },
    { name: "Carrots", category: "Vegetables", unit: "kg", cost: 60 },
    { name: "Beetroot", category: "Vegetables", unit: "kg", cost: 70 },
    { name: "Cucumber", category: "Vegetables", unit: "kg", cost: 50 },
    { name: "Celery", category: "Vegetables", unit: "kg", cost: 90 },

    // Dairy
    { name: "Yogurt", category: "Dairy", unit: "kg", cost: 120 },
    { name: "Milk", category: "Dairy", unit: "liter", cost: 60 },
    { name: "Almond Milk", category: "Dairy", unit: "liter", cost: 180 },
    { name: "Coconut Milk", category: "Dairy", unit: "liter", cost: 160 },
    { name: "Soy Milk", category: "Dairy", unit: "liter", cost: 150 },

    // Sweeteners
    { name: "Honey", category: "Sweeteners", unit: "kg", cost: 350 },
    { name: "Maple Syrup", category: "Sweeteners", unit: "liter", cost: 550 },
    { name: "Agave Nectar", category: "Sweeteners", unit: "liter", cost: 450 },
    { name: "Stevia", category: "Sweeteners", unit: "kg", cost: 800 },

    // Herbs
    { name: "Mint", category: "Herbs", unit: "kg", cost: 200 },
    { name: "Basil", category: "Herbs", unit: "kg", cost: 250 },

    // Nuts & Seeds
    { name: "Almonds", category: "Nuts & Seeds", unit: "kg", cost: 850 },
    { name: "Walnuts", category: "Nuts & Seeds", unit: "kg", cost: 900 },
    { name: "Chia Seeds", category: "Nuts & Seeds", unit: "kg", cost: 700 },
    { name: "Flax Seeds", category: "Nuts & Seeds", unit: "kg", cost: 600 },

    // Superfoods
    { name: "Acai Powder", category: "Superfoods", unit: "kg", cost: 1200 },
    { name: "Spirulina", category: "Superfoods", unit: "kg", cost: 1500 },
    { name: "Wheatgrass", category: "Superfoods", unit: "kg", cost: 1100 },

    // Supplements
    { name: "Protein Powder", category: "Supplements", unit: "kg", cost: 1000 },
    { name: "Collagen", category: "Supplements", unit: "kg", cost: 1300 },

    // Base Liquids
    {
      name: "Coconut Water",
      category: "Base Liquids",
      unit: "liter",
      cost: 200,
    },
    {
      name: "Sparkling Water",
      category: "Base Liquids",
      unit: "liter",
      cost: 80,
    },
    { name: "Green Tea", category: "Base Liquids", unit: "liter", cost: 150 },

    // Ice & Frozen
    { name: "Ice Cubes", category: "Ice & Frozen", unit: "kg", cost: 30 },
    { name: "Frozen Yogurt", category: "Ice & Frozen", unit: "kg", cost: 180 },

    // Toppings
    { name: "Granola", category: "Toppings", unit: "kg", cost: 300 },
    { name: "Coconut Flakes", category: "Toppings", unit: "kg", cost: 350 },
    {
      name: "Dark Chocolate Chips",
      category: "Toppings",
      unit: "kg",
      cost: 450,
    },

    // Garnishes
    { name: "Mint Leaves", category: "Garnishes", unit: "kg", cost: 200 },
    { name: "Lemon Slices", category: "Garnishes", unit: "kg", cost: 100 },
    { name: "Orange Zest", category: "Garnishes", unit: "kg", cost: 150 },
  ];

  const recipeCategories = [
    "Juices",
    "Smoothies",
    "Bowls",
    "Fruit Platters",
    "Infused Waters",
    "Milkshakes",
    "Mocktails",
    "Fresh Cuts",
    "Wellness Shots",
    "Seasonal Specials",
  ];

  const recipes = [
    // Juices
    { name: "Fresh Orange Juice", category: "Juices", price: 120 },
    { name: "Watermelon Cooler", category: "Juices", price: 130 },
    { name: "Apple-Carrot-Ginger", category: "Juices", price: 150 },
    { name: "Green Detox", category: "Juices", price: 180 },
    { name: "Beetroot Energizer", category: "Juices", price: 160 },
    { name: "Pineapple Paradise", category: "Juices", price: 140 },

    // Smoothies
    { name: "Berry Blast Smoothie", category: "Smoothies", price: 200 },
    { name: "Tropical Delight Smoothie", category: "Smoothies", price: 220 },
    { name: "Green Goddess", category: "Smoothies", price: 240 },
    { name: "Protein Power", category: "Smoothies", price: 250 },
    { name: "Banana Peanut Butter", category: "Smoothies", price: 230 },

    // Bowls
    { name: "Acai Bowl", category: "Bowls", price: 300 },
    { name: "Dragon Fruit Bowl", category: "Bowls", price: 320 },
    { name: "Mango Sunrise Bowl", category: "Bowls", price: 280 },
    { name: "Green Energy Bowl", category: "Bowls", price: 290 },

    // Fruit Platters
    { name: "Seasonal Fruit Platter", category: "Fruit Platters", price: 350 },
    { name: "Exotic Fruit Platter", category: "Fruit Platters", price: 450 },
    { name: "Berry Medley", category: "Fruit Platters", price: 380 },

    // Infused Waters
    { name: "Cucumber Mint Infusion", category: "Infused Waters", price: 100 },
    { name: "Citrus Blast", category: "Infused Waters", price: 110 },
    { name: "Berry Refresh", category: "Infused Waters", price: 120 },

    // Milkshakes
    { name: "Banana Milkshake", category: "Milkshakes", price: 180 },
    { name: "Strawberry Dream", category: "Milkshakes", price: 190 },
    { name: "Mango Tango", category: "Milkshakes", price: 200 },

    // Mocktails
    { name: "Virgin Mojito", category: "Mocktails", price: 160 },
    { name: "Fruit Punch", category: "Mocktails", price: 180 },
    { name: "Watermelon Mint Cooler", category: "Mocktails", price: 170 },

    // Fresh Cuts
    { name: "Fresh Cut Pineapple", category: "Fresh Cuts", price: 120 },
    { name: "Watermelon Slices", category: "Fresh Cuts", price: 100 },
    { name: "Mixed Fruit Cup", category: "Fresh Cuts", price: 150 },

    // Wellness Shots
    { name: "Ginger Shot", category: "Wellness Shots", price: 80 },
    { name: "Turmeric Immunity", category: "Wellness Shots", price: 90 },
    { name: "Wheatgrass Shot", category: "Wellness Shots", price: 100 },

    // Seasonal Specials
    { name: "Summer Splash", category: "Seasonal Specials", price: 220 },
    { name: "Autumn Harvest", category: "Seasonal Specials", price: 240 },
    { name: "Winter Warmer", category: "Seasonal Specials", price: 250 },
  ];

  const wasteReasons = [
    "Spoiled",
    "Over-produced",
    "Expired",
    "Preparation error",
    "Customer return",
    "Spillage",
    "Contamination",
    "Power outage spoilage",
    "Improper storage",
    "Quality control rejection",
  ];

  // Menu related data
  const menuTypes = [
    "Regular Menu",
    "Morning Refresh",
    "Afternoon Energize",
    "Weekend Special",
    "Detox Menu",
    "Seasonal Collection",
    "Summer Coolers",
    "Winter Warmers",
    "Immunity Boosters",
  ];

  const menuSections = [
    "Fresh Juices",
    "Power Smoothies",
    "Acai & Fruit Bowls",
    "Fruit Platters & Cuts",
    "Wellness Shots",
    "Infused Waters",
    "Milkshakes",
    "Seasonal Specials",
    "Mocktails",
    "Protein Add-ons",
    "Superfood Add-ons",
  ];

  // Cities and areas
  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Ahmedabad",
    "Lucknow",
    "New York",
    "Los Angeles",
    "London",
    "Sydney",
    "Toronto",
  ];

  const areas = [
    "Downtown",
    "Central Park",
    "Beachfront",
    "Business District",
    "University Area",
    "Shopping Mall",
    "Health Center",
    "Sports Complex",
    "Train Station",
    "Airport",
    "Fitness District",
    "Wellness Hub",
    "Tech Park",
    "Market Square",
    "Hospital Zone",
  ];

  console.log("Creating fruit & juice restaurants and users...");

  // Create restaurants with users and data
  for (let r = 0; r < RESTAURANT_COUNT; r++) {
    // Select random city and area
    const city = getRandomItem(cities);
    const area = getRandomItem(areas);

    // Fruit & Juice restaurant names
    const restaurantNames = [
      "Juice Boost",
      "Fruit Fusion",
      "The Juice Bar",
      "Blended Bliss",
      "Fresh Press",
      "Tropical Squeeze",
      "Pure & Pulp",
      "Berry Good",
      "Smoothie Haven",
      "Nature's Nectar",
      "Fruity Delights",
    ];

    const restaurantName = restaurantNames[r % restaurantNames.length];

    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        address: `${Math.floor(Math.random() * 100) + 1}, ${area}, ${city}`,
        phone: `+${Math.floor(Math.random() * 90) + 10}-${
          Math.floor(Math.random() * 9000000000) + 1000000000
        }`,
      },
    });

    console.log(`Created restaurant: ${restaurant.name} in ${city}`);

    // Create users for this restaurant
    const users = [];
    const roles = ["owner", "manager", "staff"];

    // Staff names
    const staffNames = [
      "Alex Johnson",
      "Sam Wilson",
      "Jordan Lee",
      "Taylor Smith",
      "Jamie Brown",
      "Casey Miller",
      "Riley Davis",
      "Morgan Wilson",
      "Drew Parker",
      "Quinn Thomas",
    ];

    for (let u = 0; u < USERS_PER_RESTAURANT; u++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);

      const userName = staffNames[r * USERS_PER_RESTAURANT + u];

      const user = await prisma.user.create({
        data: {
          name: userName || `User ${r * USERS_PER_RESTAURANT + u + 1}`,
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
          minQuantity: getRandomInt(1, 10),
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
          description: `Refreshing ${recipe.name.toLowerCase()} made with fresh, hand-selected fruits.`,
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

      // Create special seasonal menus
      const seasons = [
        "Spring",
        "Summer",
        "Autumn",
        "Winter",
        "Detox",
        "Immunity",
        "Energy",
        "Wellness",
      ];

      const seasonName =
        Math.random() > 0.7 ? ` - ${getRandomItem(seasons)} Collection` : "";

      const menu = await prisma.menu.create({
        data: {
          name: `${menuName}${seasonName}`,
          description: `${menuName} featuring our freshest fruits and signature drinks`,
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

  console.log(
    "Database seed for Fruit & Juice restaurants completed successfully"
  );
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
