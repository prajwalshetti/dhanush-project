import BloodRequest from "../models/bloodRequest.js";

// Create a blood request
export const createBloodRequest = async(req,res)=>{
    try{
        const { blood_group, units_needed, hospital, location, urgency_level } = req.body;

        if (!blood_group || !units_needed || !hospital || !location || !urgency_level) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const requester_id = req.user.id;

        const bloodRequest = new BloodRequest({requester_id , blood_group , units_needed , hospital , location , urgency_level})

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


