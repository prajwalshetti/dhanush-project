import Donation from "../models/donation.js";
import BloodRequest from "../models/bloodRequest.js";
import User from "../models/userModel.js";

// Create a blood request
export const createBloodRequest = async(req,res)=>{
    try{
        const { blood_group, units_needed, hospital, location, urgency_level, latitude, longitude } = req.body;

        if (!blood_group || !units_needed || !hospital || !location || !urgency_level) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const requester_id = req.user.id;

        const bloodRequest = new BloodRequest({requester_id , blood_group , units_needed , hospital , location , urgency_level,latitude,longitude})

        await bloodRequest.save()

        res.status(201).json({
            message: "Blood request created successfully",
            bloodRequest,
        })
    }
    catch(err){
        console.error("Error creating blood request:", err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getBloodRequests = async (req, res) => {
    try {  
        const { blood_group, location } = req.query;

        let filter = {};
        if (blood_group) filter.blood_group = blood_group;
        if (location) filter.location = location;

        // Fetch all blood requests, sorted by newest first
        const bloodRequests = await BloodRequest.find().sort({ createdAt: -1 });

        res.status(200).json(bloodRequests);
    } catch (error) {
        console.error("Error fetching blood requests:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const updateBloodRequestStatus = async(req, res) => {
    try {
      const {id} = req.params;
      const {status} = req.body;
  
      const validStatuses = ["pending", "fulfilled", "cancelled"];
  
      if(!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
  
      if (status === "fulfilled") {
        // Find the request first
        const bloodRequest = await BloodRequest.findById(id);
        if (!bloodRequest) {
          return res.status(404).json({ message: "Blood request not found" });
        }
        
        // Update the status and fulfilled_at fields
        bloodRequest.status = "fulfilled";
        bloodRequest.fulfilled_at = new Date();
        await bloodRequest.save();
        
        return res.status(200).json({ 
          message: "Blood request fulfilled successfully",
          bloodRequest
        });
      } else {
        // Update status only (for pending/cancelled)
        const updatedRequest = await BloodRequest.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
  
        if (!updatedRequest) {
          return res.status(404).json({ message: "Blood request not found" });
        }
  
        res.status(200).json(updatedRequest);
      }
    } catch(err) {
      console.error("Error updating blood request status:", err);
      res.status(500).json({ message: "Server Error" });
    }
  };
export const deleteBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the request
        const bloodRequest = await BloodRequest.findById(id);
        if (!bloodRequest) {
            return res.status(404).json({ message: "Blood request not found" });
        }

        // Remove the authorization check to test if deletion works
        await BloodRequest.findByIdAndDelete(id);
        res.status(200).json({ message: "Blood request deleted successfully" });

    } catch (err) {
        console.error("Error deleting blood request:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getEligibleBloodRequests = async(req,res)=>{
   
    try{
        const donorId = req.user.id;

        // Fetch the donor's details (blood group and location)
        const donor = await User.findById(donorId).select("blood_group location");
        if (!donor) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch blood requests that match donor's blood group and location
        const eligibleRequests = await BloodRequest.find({
            blood_group: donor.blood_group, 
            location: donor.location,      
            status: "pending",              
        }).sort({ createdAt: -1 });

        res.status(200).json({ requests: eligibleRequests });
    }
    catch(err)
    {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const getUserBloodRequest = async(req,res)=>{
    try{
      const userId = req.user.id

      console.log("User ID from request:", userId);

      const bloodRequests = await BloodRequest.find({
        requester_id: userId
      }).sort({createdAt : -1})

      console.log("bloodRequests");
      console.log(bloodRequests);

      res.status(200).json(Array.isArray(bloodRequests) ? bloodRequests : []);

    }
    catch(err)
    {
        console.error("Error fetching user blood requests:", err);
        res.status(500).json({ message: "Server Error" });
    }
}

// @route GET /api/requests/donations-received
// to get donationrequests for a particular request

export const getReceivedDonations = async(req,res)=>{
    try{
        const userBloodRequests = await BloodRequest.find({ requester_id: req.user.id }).select("_id") // gives an array of objects
       
        if (!userBloodRequests.length) {
            return res.status(200).json({ donations: [] }); // No donations if user has no requests
        }

        const bloodRequestIds = userBloodRequests.map(req => req._id);  //gives an array which stores ids(not in object form)

        const donations = await Donation.find({ request_id: { $in: bloodRequestIds } })
            .populate("donor_id", "name email")
            .populate("request_id", "blood_group units_needed status");

         res.status(200).json({ donations });


    }
    catch(err)
    {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


