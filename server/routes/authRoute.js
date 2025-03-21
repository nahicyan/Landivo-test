
import express from "express";
import { handleAuth0Login, handleAuth0Logout, getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

// Auth0 callback handler
router.get("/callback", handleAuth0Login);

// Get current user
router.get("/me", getCurrentUser);

// Logout route
router.get("/logout", handleAuth0Logout);

export { router as authRoute };