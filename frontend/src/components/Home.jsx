import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DonorInfoModal from "./DonorInfoModal";
import DonationRequests from "./DonationRequests";
import CurrentRequests from "./CurrentRequests";
import PastRequests from "./PastRequests";

const Home = () => {
  // State management
  const [userRequests, setUserRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const [hasActiveRequests, setHasActiveRequests] = useState(false);
  const [donations, setDonations] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDonorInfo, setShowDonorInfo] = useState(false);
  const [currentDonorInfo, setCurrentDonorInfo] = useState(null);
  const [completedDonations, setCompletedDonations] = useState({});

  // Fetch user requests
  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/bloodrequest/user",
        { withCredentials: true }
      );
      const requests = response.data;

      // Filter active and past requests
      const activeRequests = requests.filter((req) => req.status === "pending");
      const pastRequests = requests.filter(
        (req) => req.status === "fulfilled" || req.status === "cancelled"
      );

      setUserRequests(activeRequests);
      setPastRequests(pastRequests);
      setHasActiveRequests(activeRequests.length > 0);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      toast.error("Failed to fetch your blood requests. Please try again later.");
    }
  };

  // Fetch received donations
  const fetchReceivedDonations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/bloodrequest/donations-received",
        { withCredentials: true }
      );

      const donationsData = response.data.donations || [];
      setDonations(donationsData);

      // Create a map of completed donations to easily find donor info for past requests
      const completedDonationsMap = {};
      donationsData.forEach((donation) => {
        if (donation.status === "completed" && donation.request_id) {
          completedDonationsMap[donation.request_id._id] = donation;
        }
      });
      setCompletedDonations(completedDonationsMap);
    } catch (err) {
      console.error("Error fetching received donations:", err);
      toast.error("Failed to fetch received donations. Please try again later.");
    }
  };

  // Update donation status
  const handleUpdateStatus = async (donationId, status, requestId) => {
    setIsUpdating(true);
    try {
      // Update donation status
      const donationResponse = await axios.put(
        `http://localhost:8000/api/donations/update/${donationId}`,
        { status },
        { withCredentials: true }
      );

      // If donation is completed, update the blood request status to fulfilled
      if (status === "completed" && requestId) {
        await axios.patch(
          `http://localhost:8000/api/bloodrequest/${requestId}/status`,
          { status: "fulfilled" },
          { withCredentials: true }
        );

        // Store donor information for viewing later
        if (donationResponse.data.donorInfo) {
          setCurrentDonorInfo({
            donation: donationResponse.data.donation,
            donor: donationResponse.data.donorInfo,
            requester: donationResponse.data.requesterInfo,
          });
          setShowDonorInfo(true);
          
          // Toast notification will be handled in the DonorInfoModal component
        }
        
        toast.success(`Donation status updated to ${status}!`);
      } else if (status === "rejected") {
        toast.info("Donation has been rejected.");
      } else {
        toast.success(`Donation status updated to ${status}!`);
      }

      // Refresh data after updates
      await fetchUserRequests();
      await fetchReceivedDonations();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // View donor information for a past request
  const viewDonorInfo = (requestId) => {
    const donation = completedDonations[requestId];
    if (donation) {
      setCurrentDonorInfo({
        donation: donation,
        donor: donation.donor_id,
        requester: { request: donation.request_id },
      });
      setShowDonorInfo(true);
    } else {
      toast.error("Donor information not available", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchUserRequests();
    fetchReceivedDonations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold text-center my-4">
        Blood Donation & Emergency Platform
      </h1>
      <Navbar />
      <div className="flex-grow px-4">
        {showDonorInfo && (
          <DonorInfoModal
            currentDonorInfo={currentDonorInfo}
            onClose={() => setShowDonorInfo(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            <Link to="/request" className="text-xl font-bold">
              Request
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Request blood donation
            </p>
          </div>
          <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            <Link to="/donate" className="text-xl font-bold">
              Donate
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Register to donate blood
            </p>
          </div>
          {hasActiveRequests && (
            <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <Link to="/donors" className="text-xl font-bold">
                Available Donors
              </Link>
              <p className="text-sm text-gray-600 mt-2">
                View donors for your requests
              </p>
            </div>
          )}
        </div>

        <DonationRequests
          donations={donations}
          isUpdating={isUpdating}
          handleUpdateStatus={handleUpdateStatus}
        />

        <CurrentRequests userRequests={userRequests} />

        <PastRequests
          pastRequests={pastRequests}
          completedDonations={completedDonations}
          viewDonorInfo={viewDonorInfo}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;