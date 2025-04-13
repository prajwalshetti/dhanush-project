    import express from "express";
    import { changePassword, getUserProfile, updateUserProfile } from "../controllers/userProfile.js";
    //import { uploadProfilePicture } from "../controllers/userProfile.js";

    import protectedRoute from "../middlewares/AuthMiddleware.js";
    import upload from "../middlewares/uploadMiddleware.js";


    const router = express.Router();

    // Get user profile
    router.get("/profile", protectedRoute, getUserProfile);

    // Update user profile
    router.put("/update", protectedRoute, updateUserProfile);

    router.put("/change-password",protectedRoute , changePassword);

    //upload profilepicture
   // router.post("/upload", protectedRoute, upload.single("profilePic"), uploadProfilePicture);


    export default router;