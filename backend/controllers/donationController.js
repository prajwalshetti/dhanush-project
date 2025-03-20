import Donation from '../models/donation.js'
import BloodRequest from '../models/bloodRequest.js';
import User from '../models/userModel.js'
import { sendSMS } from "../utils/twilio.js";

// @desc Register a new donation
// @route POST /api/donations/register
// @access Private
// export const registerDonation = async (req, res) =>{
//     try{
//         const {request_id, donation_date, status,city} = req.body;

//         if(!donation_date){
//             return res.status(400).json({message: "donation date is required"});
//         }
//         if (!location) {
//             return res.status(400).json({ message: "donation location is required" });
//           }

//         const newDonation = new Donation({
//             donor_id : req.user.id,
//             request_id: request_id || null,
//             donation_date,
//             status: status || "pending",
//             city
//         });

//         await newDonation.save();
//         res.status(201).json({message: "donation registered successfully", donation:newDonation});

//     }
//     catch(error){
//         res.status(500).json({message:"server error", error: error.message});
//     }
// };

// @desc Register a new donation
// @route POST /api/donations/register
// @access Private

export const getUserDonations  = async (req, res) => {
    try{
        const donations = await Donation.find({donor_id: req.user.id})
        .populate("request_id", "blood_group units_needed status")
        .sort({donation_date: -1});

        res.status(200).json({donations})
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc Update donation status
// @route PUT /api/donations/update/:donationId
// @access Private
// controllers/donationController.js


export const updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;
    
    // Validate status: allowed values are "pending", "completed", or "cancelled"
    const validStatuses = ["pending", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    // Find and update the donation status
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { status },
      { new: true }
    ).populate("request_id donor_id");
    
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    // If donation is marked as completed, update the blood request status to "fulfilled"
    if (status === "completed" && donation.request_id) {
      await BloodRequest.findByIdAndUpdate(
        donation.request_id._id,
        { status: "fulfilled", fulfilled_at: new Date() },
        { new: true }
      );
    }
    
    // Get donor and requester information
    const donorInfo = await User.findById(donation.donor_id).select("name email phone");
    const requesterInfo = await User.findById(donation.request_id.requester_id).select("name email phone");
    
    // If donation is completed, send an SMS to the requester with donor details
    if (status === "completed" && requesterInfo && donorInfo) {
      const smsMessage = `Donation accepted! Donor details - Name: ${donorInfo.name}, Email: ${donorInfo.email}, Phone: ${donorInfo.phone}.`;
      await sendSMS(requesterInfo.phone, smsMessage);


      const smsMessageToDonor = `Your donation request has been accepted! Requester details - Name: ${requesterInfo.name}, Email: ${requesterInfo.email}, Phone: ${requesterInfo.phone}.`;
      await sendSMS(donorInfo.phone, smsMessageToDonor);
    }
    
    res.status(200).json({
      message: `Donation status updated to ${status}`,
      donation,
      donorInfo,
      requesterInfo
    });
  } catch (err) {
    console.error("Error updating donation status:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


export const sendDonationRequest = async(req,res)=>{

      try{
        const { request_id } = req.body;
         
        const bloodRequest = await BloodRequest.findById(request_id);
        if (!bloodRequest) {
            return res.status(404).json({ message: "Blood request not found" });
        }

         // Check if donor has already sent a request
         const existingDonation = await Donation.findOne({
            donor_id: req.user.id,
            request_id,
        });

        if (existingDonation) {
            return res.status(400).json({ message: "You have already requested to donate for this request." });
        }
         

        // Create new donation request
        const newDonation = new Donation({
            donor_id: req.user.id,
            request_id,
            status: "pending",
        });

        await newDonation.save();


        //Later Notify maadbeku..!!

        res.status(201).json({ 
            message: "Donation request sent successfully. Waiting for requester to accept.", 
            donation: newDonation 
        });

      }
      catch(err)
      {
        res.status(500).json({ message: "Server error", error: err.message });
      }
}



