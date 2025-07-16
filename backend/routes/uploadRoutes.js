import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { handleProfileUpload } from "../controllers/uploadController.js";
import protectedRoute from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/upload-profile", protectedRoute,upload.single("avatar"), handleProfileUpload);

export default router;
