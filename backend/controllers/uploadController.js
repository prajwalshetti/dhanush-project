import s3 from "../utils/s3.js"
import User from "../models/userModel.js"
import { v4 as uuidv4 } from "uuid"

export const handleProfileUpload = async(req,res)=>{
  try{
        if (!req.file) {
    return res.status(400).json({ message: "No file uploaded or invalid file type" });
  }

  const fileName = `profile-pics/${uuidv4()}-${req.file.originalname}`;

  const uploadResult = await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Expires: 60 * 5,
    });

   const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ message: "User ID not provided" });

     await User.findByIdAndUpdate(userId, {
      profilePicture: signedUrl,
      profilePictureKey: fileName
    });

    return res.status(200).json({
  message: "Upload successful",
  s3Key: fileName,
  signedUrl
});



  }catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Failed to upload", error: err.message });
  } 
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // Optionally regenerate signed URL if needed
    if (user.profilePictureKey) {
      const signedUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: user.profilePictureKey,
        Expires: 60 * 5, // valid for 5 mins
      });
      user.profilePicture = signedUrl; // override with fresh signed URL
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};
