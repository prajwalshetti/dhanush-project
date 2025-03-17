import express from "express";
import { getUserDonations,  updateDonationStatus, sendDonationRequest} from '../controllers/donationController.js'
import ProtectedRoute from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// // Register a new donation(not using right now)
// router.post("/register", ProtectedRoute, registerDonation);

router.post('/request' ,ProtectedRoute , sendDonationRequest)

// Get donation history of a user
router.get("/", ProtectedRoute, getUserDonations);

// Update donation status (completed, pending, cancelled)
router.put("/update/:donationId", ProtectedRoute, updateDonationStatus);

export default router;