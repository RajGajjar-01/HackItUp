const { PrismaClient } = require("@prisma/client");

let prisma;

// Check if we're in production
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, create a singleton to avoid multiple connections
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
