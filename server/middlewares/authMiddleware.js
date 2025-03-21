import { syncAuth0User } from "../services/authService.js";
import { prisma } from "../config/prismaConfig.js";

export const requireAuth = async (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: req.oidc.user.email.toLowerCase() },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};