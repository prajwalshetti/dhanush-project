import { createBloodRequest, getEligibleBloodRequests } from "../controllers/requestController.js";
import { getBloodRequests } from "../controllers/requestController.js";
import { updateBloodRequestStatus } from "../controllers/requestController.js";
import { deleteBloodRequest } from "../controllers/requestController.js";
import { getUserBloodRequest } from "../controllers/requestController.js";
import express from "express";
import protectedRoute from "../middlewares/AuthMiddleware.js";

const router=express.Router()
// Create a new blood request (Protected Route)
router.post("/create",protectedRoute, createBloodRequest);

router.get("/", getBloodRequests);

router.patch("/:id/status", updateBloodRequestStatus);

router.get("/eligible" , protectedRoute , getEligibleBloodRequests)

router.delete("/:id", deleteBloodRequest);

router.get("/user", protectedRoute, getUserBloodRequest);
export default router;