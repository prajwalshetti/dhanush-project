import express from "express";
import { registerDonation, getUserDonations,  updateDonationStatus} from '../controllers/donationController.js'
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Register a new donation
router.post("/register", AuthMiddleware, registerDonation);

// Get donation history of a user
router.get("/history", AuthMiddleware, getUserDonations);

// Update donation status (completed, pending, cancelled)
router.put("/update/:donationId", AuthMiddleware, updateDonationStatus);

export default router;