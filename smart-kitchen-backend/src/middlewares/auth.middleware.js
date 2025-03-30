const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

/**
 * Middleware to authenticate user via JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication required. No token provided." });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { restaurant: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found or token is invalid." });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.error("Authentication error:", error);
    return res
      .status(500)
      .json({ message: "Server error during authentication" });
  }
};

/**
 * Middleware to check if user has restaurant owner role
 */
const isOwner = (req, res, next) => {
  if (req.user && req.user.role === "owner") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Owner privileges required." });
  }
};

/**
 * Middleware to check if user has restaurant manager role or higher
 */
const isManagerOrOwner = (req, res, next) => {
  if (req.user && (req.user.role === "owner" || req.user.role === "manager")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Manager privileges required." });
  }
};

module.exports = {
  authenticate,
  isOwner,
  isManagerOrOwner,
};
