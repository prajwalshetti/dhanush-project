import { createBloodRequest } from "../controllers/requestController.js";
import express from "express";
import protectedRoute from "../middlewares/AuthMiddleware.js";

const router=express.Router()
// Create a new blood request (Protected Route)
router.post("/create",protectedRoute, createBloodRequest);

export default router;