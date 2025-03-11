import BloodRequest from "../models/bloodRequest";

// Create a blood request
export const createRequest = async (req, res) => {
    try {
        const { blood_group, units_needed, hospital, location, location_coordinates, urgency_level, reason } = req.body;

        const newRequest = new BloodRequest({
            requester_id: req.user.id, // Authenticated user ID
            blood_group,
            units_needed,
            hospital,
            location,
            location_coordinates,
            urgency_level,
            reason,
            status: "pending"
        });

        await newRequest.save();
        res.status(201).json({ message: "Blood request created successfully", data: newRequest });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Fetch all blood requests (with optional filters)
export const getRequests = async (req, res) => {
    try {
        const { blood_group, location } = req.query;
        let filter = {};

        if (blood_group) filter.blood_group = blood_group;
        if (location) filter.location = location;

        const requests = await BloodRequest.find(filter).populate("requester_id", "name email");
        res.status(200).json({ data: requests });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update request status
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRequest = await BloodRequest.findByIdAndUpdate(
            id,
            { status, fulfilled_at: status === "fulfilled" ? Date.now() : null },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Request status updated", data: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
