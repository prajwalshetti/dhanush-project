import { createBloodRequest } from "../controllers/requestController.js";
import { getBloodRequests } from "../controllers/requestController.js";
import { updateBloodRequestStatus } from "../controllers/requestController.js";
import { deleteBloodRequest } from "../controllers/requestController.js";
import express from "express";
import protectedRoute from "../middlewares/AuthMiddleware.js";

const router=express.Router()
// Create a new blood request (Protected Route)
router.post("/create",protectedRoute, createBloodRequest);

router.get("/", getBloodRequests);

router.patch("/:id/status", updateBloodRequestStatus);

router.delete("/:id", deleteBloodRequest);
export default router;