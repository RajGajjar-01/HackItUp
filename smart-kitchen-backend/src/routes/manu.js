const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/menu
 * @desc Get all menus for a restaurant
 * @access Private
 */
router.get("/", async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const menus = await prisma.menu.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                price: true,
                imageUrl: true,
                isSpecial: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
});

/**
 * @route GET /api/menu/active
 * @desc Get currently active menus for a restaurant
 * @access Private
 */
router.get("/active", async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const today = new Date();

    const activeMenus = await prisma.menu.findMany({
      where: {
        restaurantId,
        isActive: true,
        OR: [{ endDate: null }, { endDate: { gte: today } }],
        AND: [{ startDate: null }, { startDate: { lte: today } }],
      },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                price: true,
                imageUrl: true,
                isSpecial: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    res.json(activeMenus);
  } catch (error) {
    console.error("Error fetching active menus:", error);
    res.status(500).json({ error: "Failed to fetch active menus" });
  }
});

/**
 * @route GET /api/menu/:id
 * @desc Get a single menu by ID
 * @access Private
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                price: true,
                imageUrl: true,
                isSpecial: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

/**
 * @route POST /api/menu
 * @desc Create a new menu
 * @access Private
 */
router.post("/", async (req, res) => {
  try {
    const { name, description, startDate, endDate, isActive, restaurantId } =
      req.body;

    if (!restaurantId || !name) {
      return res
        .status(400)
        .json({ error: "Restaurant ID and menu name are required" });
    }

    // Create the menu
    const newMenu = await prisma.menu.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive ?? true,
        restaurant: {
          connect: { id: restaurantId },
        },
      },
    });

    res.status(201).json(newMenu);
  } catch (error) {
    console.error("Error creating menu:", error);
    res.status(500).json({ error: "Failed to create menu" });
  }
});

/**
 * @route PUT /api/menu/:id
 * @desc Update a menu
 * @access Private
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, isActive } = req.body;

    // Check if menu exists
    const existingMenu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Update menu
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingMenu.name,
        description:
          description !== undefined ? description : existingMenu.description,
        startDate:
          startDate !== undefined
            ? new Date(startDate)
            : existingMenu.startDate,
        endDate:
          endDate !== undefined ? new Date(endDate) : existingMenu.endDate,
        isActive: isActive !== undefined ? isActive : existingMenu.isActive,
      },
    });

    res.json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ error: "Failed to update menu" });
  }
});

/**
 * @route DELETE /api/menu/:id
 * @desc Delete a menu
 * @access Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if menu exists
    const existingMenu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Delete menu (this will also delete the associated menu items due to onDelete: Cascade)
    await prisma.menu.delete({
      where: { id },
    });

    res.json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ error: "Failed to delete menu" });
  }
});

/**
 * @route POST /api/menu/:id/items
 * @desc Add items to a menu
 * @access Private
 */
router.post("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Menu items are required" });
    }

    // Check if menu exists
    const existingMenu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Get the current highest order value
    const highestOrderItem = await prisma.menuItems.findFirst({
      where: { menuId: id },
      orderBy: { order: "desc" },
    });

    let startOrder = highestOrderItem ? highestOrderItem.order + 1 : 0;

    // Create all menu items
    const menuItems = await Promise.all(
      items.map(async (item, index) => {
        // Check for duplicate items
        const existingItem = await prisma.menuItems.findFirst({
          where: {
            menuId: id,
            recipeId: item.recipeId,
          },
        });

        if (existingItem) {
          return null; // Skip existing items
        }

        return prisma.menuItems.create({
          data: {
            menu: {
              connect: { id },
            },
            recipe: {
              connect: { id: item.recipeId },
            },
            section: item.section || null,
            order: startOrder + index,
          },
        });
      })
    );

    // Filter out null values (skipped duplicates)
    const addedItems = menuItems.filter((item) => item !== null);

    res.status(201).json({
      message: `Added ${addedItems.length} items to menu`,
      skipped: items.length - addedItems.length,
      items: addedItems,
    });
  } catch (error) {
    console.error("Error adding menu items:", error);
    res.status(500).json({ error: "Failed to add menu items" });
  }
});

/**
 * @route DELETE /api/menu/:menuId/items/:itemId
 * @desc Remove an item from a menu
 * @access Private
 */
router.delete("/:menuId/items/:itemId", async (req, res) => {
  try {
    const { menuId, itemId } = req.params;

    // Check if menu item exists
    const existingItem = await prisma.menuItems.findFirst({
      where: {
        id: itemId,
        menuId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Delete the menu item
    await prisma.menuItems.delete({
      where: { id: itemId },
    });

    // Reorder remaining items to keep order continuous
    const remainingItems = await prisma.menuItems.findMany({
      where: { menuId },
      orderBy: { order: "asc" },
    });

    await Promise.all(
      remainingItems.map((item, index) =>
        prisma.menuItems.update({
          where: { id: item.id },
          data: { order: index },
        })
      )
    );

    res.json({ message: "Item removed from menu successfully" });
  } catch (error) {
    console.error("Error removing menu item:", error);
    res.status(500).json({ error: "Failed to remove menu item" });
  }
});

/**
 * @route PUT /api/menu/:menuId/items/:itemId
 * @desc Update a menu item (section, order)
 * @access Private
 */
router.put("/:menuId/items/:itemId", async (req, res) => {
  try {
    const { menuId, itemId } = req.params;
    const { section, order } = req.body;

    // Check if menu item exists
    const existingItem = await prisma.menuItems.findFirst({
      where: {
        id: itemId,
        menuId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Update the menu item
    const updatedItem = await prisma.menuItems.update({
      where: { id: itemId },
      data: {
        section: section !== undefined ? section : existingItem.section,
        order: order !== undefined ? order : existingItem.order,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

/**
 * @route POST /api/menu/:id/set-active
 * @desc Activate or deactivate a menu
 * @access Private
 */
router.post("/:id/set-active", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ error: "isActive status is required (boolean)" });
    }

    // Check if menu exists
    const existingMenu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Update menu active status
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: { isActive },
    });

    res.json({
      message: isActive
        ? "Menu activated successfully"
        : "Menu deactivated successfully",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu active status:", error);
    res.status(500).json({ error: "Failed to update menu active status" });
  }
});

/**
 * @route POST /api/menu/:id/reorder
 * @desc Reorder menu items
 * @access Private
 */
router.post("/:id/reorder", async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Items array is required" });
    }

    // Validate items - each should have id and order properties
    const isValid = items.every(
      (item) => item.id && typeof item.order === "number"
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Each item must have id and order" });
    }

    // Update each item's order
    const updates = await Promise.all(
      items.map((item) =>
        prisma.menuItems.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    res.json({
      message: "Menu items reordered successfully",
      updatedItems: updates.length,
    });
  } catch (error) {
    console.error("Error reordering menu items:", error);
    res.status(500).json({ error: "Failed to reorder menu items" });
  }
});

module.exports = router;
