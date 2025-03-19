import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userProfile.js";
import protectedRoute from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/", protectedRoute, getUserProfile);

// Update user profile
router.put("/", protectedRoute, updateUserProfile);

export default router;