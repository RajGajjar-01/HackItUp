const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

/**
 * Register a new user
 */
const signup = async (req, res) => {
  try {
    const { name, email, password, role, restaurantName, address, phone } =
      req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Start transaction to create restaurant and user
    const result = await prisma.$transaction(async (prisma) => {
      // Create restaurant if name is provided
      let restaurant = null;
      if (restaurantName) {
        restaurant = await prisma.restaurant.create({
          data: {
            name: restaurantName,
            address,
            phone,
          },
        });
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || "owner",
          restaurantId: restaurant ? restaurant.id : null,
        },
        include: {
          restaurant: true,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return { user, token };
    });

    // Remove password from response
    const { password: _, ...userData } = result.user;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      token: result.token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * Log in existing user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: { restaurant: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * Get current authenticated user
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password: _, ...userData } = user;

    res.status(200).json({
      user: userData,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error while getting user data" });
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};
