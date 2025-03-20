import User from "../models/userModel.js"

//getting User profile
export const getUserProfile=async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(202).json(user);
    }
    catch{
        res.status(405).json({ message: "Server Error" });
    }
}

//update
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.blood_group = req.body.blood_group || user.blood_group;
        user.location = req.body.location || user.location;
        user.health_status = req.body.health_status || user.health_status;
        user.last_donation_date = req.body.last_donation_date || user.last_donation_date;

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

// Upload Profile Picture
// export const uploadProfilePicture = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         const user = await User.findById(req.user._id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         user.profilePicture = `/uploads/${req.file.filename}`;
//         await user.save();

//         res.status(200).json({ message: "Profile picture uploaded", profilePicture: user.profilePicture });
//     } catch (error) {
//         res.status(500).json({ message: "Error uploading profile picture" });
//     }
// };