import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import path from "path";
import fs from "fs";
import protectedRoute from "../middlewares/AuthMiddleware.js";
import userModel from '../models/userModel.js'; // Make sure this path is correct
// If you're using DonorProfile model, import it instead
// import donorProfileModel from '../models/DonorProfile.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post("/", protectedRoute, (req, res, next) => {
  console.log("Upload route accessed, proceeding to multer middleware");
  next();
}, upload.single('image'), async (req, res) => {
  try {
    console.log("Multer processed request, user:", req.user);
    console.log("File data:", req.file);
    
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Check if req.user exists and has email
    if (!req.user || !req.user.email) {
      console.error("User information missing in request");
      return res.status(401).json({ message: "User information missing" });
    }
    
    try {
      // Find user document
      let user = await userModel.findOne({email: req.user.email});
      
      if (!user) {
        console.error("User not found:", req.user.email);
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log("User found:", user._id);
      
      // Update profile picture field
      user.profilePicture = req.file.filename;
      await user.save();
      console.log("User updated with new profile picture");
      
      // Create URL for the uploaded file
      const imageUrl = `/uploads/${req.file.filename}`;
      
      return res.status(200).json({ 
        imageUrl,
        message: "File uploaded successfully" 
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ 
        message: "Database error", 
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

export default router;