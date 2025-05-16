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
import MyDonations from "./MyDonations";
import socket from "../socket.js";
import { updateUserLocation } from "../utils/locationUpdater";

const Home = ({user}) => {
  // State management
  const [userRequests, setUserRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const [hasActiveRequests, setHasActiveRequests] = useState(false);
  const [donations, setDonations] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState({
    requests: true,
    receivedDonations: true,
    myDonations: true
  });
  const [showDonorInfo, setShowDonorInfo] = useState(false);
  const [currentDonorInfo, setCurrentDonorInfo] = useState(null);
  const [completedDonations, setCompletedDonations] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [locationUpdated, setLocationUpdated] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL

  // Fetch user requests
  const fetchUserRequests = async () => {
    setLoading(prev => ({ ...prev, requests: true }));
    try {
      const response = await axios.get(
        `${base_url}/api/bloodrequest/user`,
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
      if (error.response) {
        console.error(`Server error: ${error.response.data.message || 'Failed to fetch blood requests'}`);
      } else if (error.request) {
        console.error("No response from server. Please check your connection.");
      } else {
        console.error("Failed to fetch your blood requests. Please try again later.");
      }
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  // Fetch received donations
  const fetchReceivedDonations = async () => {
    setLoading(prev => ({ ...prev, receivedDonations: true }));
    try {
      const response = await axios.get(
        `${base_url}/api/bloodrequest/donations-received`,
        { withCredentials: true }
      );

      const donationsData = response.data.donations || [];
      
      // Process donations to ensure all have necessary properties
      const processedDonations = donationsData.map(donation => {
        if (!donation.request_id) {
          donation.request_id = { _id: "unknown", blood_group: "unknown", status: "unknown" };
        }
        if (!donation.donor_id) {
          donation.donor_id = { name: "Unknown", email: "unknown", phone: "unknown" };
        }
        return donation;
      });
      
      setDonations(processedDonations);

      // Create a map of completed donations to easily find donor info for past requests
      const completedDonationsMap = {};
      processedDonations.forEach((donation) => {
        if (donation.status === "completed" && donation.request_id) {
          completedDonationsMap[donation.request_id._id] = donation;
        }
      });
      setCompletedDonations(completedDonationsMap);
    } catch (err) {
      console.error("Error fetching received donations:", err);
      if (err.response) {
        console.error(`Server error: ${err.response.data.message || 'Failed to fetch donations'}`);
      } else if (err.request) {
        console.error("No response from server. Please check your connection.");
      } else {
        console.error("Failed to fetch received donations. Please try again later.");
      }
    } finally {
      setLoading(prev => ({ ...prev, receivedDonations: false }));
    }
  };

  // Fetch my donations (outgoing)
  const fetchMyDonations = async () => {
    setLoading(prev => ({ ...prev, myDonations: true }));
    try {
      const response = await axios.get(
        `${base_url}/api/donations`,
        { withCredentials: true }
      );

      // Process donations to ensure they have necessary properties
      const donationsData = response.data.donations || [];
      const processedDonations = donationsData.map(donation => {
        if (!donation.request_id) {
          donation.request_id = { blood_group: "unknown", units_needed: "unknown", location: "unknown" };
        }
        if (!donation.requester_id) {
          donation.requester_id = { name: "Unknown", email: "unknown", phone: "unknown" };
        }
        return donation;
      });
      
      setMyDonations(processedDonations);
    } catch (err) {
      console.error("Error fetching my donations:", err);
      if (err.response) {
        console.error(`Server error: ${err.response.data.message || 'Failed to fetch your donations'}`);
      } else if (err.request) {
        console.error("No response from server. Please check your connection.");
      } else {
        console.error("Failed to fetch your donation history. Please try again later.");
      }
    } finally {
      setLoading(prev => ({ ...prev, myDonations: false }));
    }
  };

  // Update donation status
  const handleUpdateStatus = async (donationId, status, requestId) => {
    setIsUpdating(true);
    try {
      // Update donation status
      const donationResponse = await axios.put(
        `${base_url}/api/donations/update/${donationId}`,
        { status },
        { withCredentials: true }
      );
  
      // Find the donation in our state to get donor information
      const donation = donations.find(d => d._id === donationId);
      const donorId = donation?.donor_id?._id;
      
      // Emit socket event for donor notification
      socket.emit('donationStatusUpdated', {
        donationId,
        status,
        requestId,
        donorId, // This helps target the specific donor
        requesterName: currentDonorInfo?.requester?.name || "The requester"
      });
  
      // If donation is completed, update the blood request status to fulfilled
      if (status === "completed" && requestId) {
        await axios.patch(
          `${base_url}/api/bloodrequest/${requestId}/status`,
          { status: "fulfilled" },
          { withCredentials: true }
        );
  
        // Store donor information for viewing later
        if (donationResponse.data.donation && donationResponse.data.donorInfo) {
          setCurrentDonorInfo({
            donation: donationResponse.data.donation,
            donor: donationResponse.data.donorInfo,
            requester: donationResponse.data.requesterInfo || {},
          });
          setShowDonorInfo(true);
        } else {
          console.error("Missing donation or donor information in response");
          toast.warning("Donation accepted but donor information might be incomplete");
        }
      } else if (status === "cancelled") {
        toast.info("Donation request has been rejected.");
      } else {
        toast.success(`Donation status updated to ${status}!`);
      }
  
      // Refresh data after updates
      await refreshData();
    } catch (err) {
      console.error("Error updating status:", err);
      if (err.response) {
        console.error(`Server error: ${err.response.data.message || 'Failed to update status'}`);
      } else if (err.request) {
        console.error("No response from server. Please check your connection.");
      } else {
        console.error("Failed to update status. Please try again.");
      }
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
      console.error("Donor information not available. The donation may not be completed yet.", {
        position: "top-center",
      });
    }
  };

  // Refresh all data
  const refreshData = async () => {
    try {
      await Promise.all([
        fetchUserRequests(),
        fetchReceivedDonations(),
        fetchMyDonations()
      ]);
      setLastUpdated(new Date());
      // toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing data:", error);
      console.error("Failed to refresh some data. Please try again.");
    }
  };

  // Update user location - runs once when component mounts and whenever user changes
  useEffect(() => {
    if (!user) {
      console.log("[GeoLocation] No user yet—skipping location update");
      return;
    }
    
    // Only update location once per session
    if (locationUpdated) {
      console.log("[GeoLocation] Location already updated this session");
      return;
    }

    console.log("[GeoLocation] Starting location update process");
    
    // Use the utility function to update location
    updateUserLocation(
      // Success callback
      (location) => {
        console.log("[GeoLocation] Location updated successfully:", location);
        setLocationUpdated(true);
        toast.success("Your location has been updated successfully!", {
          position: "top-center",
          autoClose: 5000,
        });
      },
      // Error callback
      (error) => {
        console.error("[GeoLocation] Failed to update location:", error);
        console.error("Failed to update your location. Some features may not work properly.", {
          position: "top-center",
          autoClose: 5000,
        });
      },
      // Permission denied callback
      () => {
        console.warn("[GeoLocation] Location permission denied");
        toast.warning("Please enable location services to improve matching with nearby donors/recipients", {
          position: "top-center",
          autoClose: 8000,
        });
      }
    ).catch((err) => {
      console.error("[GeoLocation] Uncaught location error:", err);
    });
  }, [user, locationUpdated]);
  
  // Listen for donation status updates
  useEffect(() => {
    const handleDonationStatusUpdate = (data) => {
      // Use functional update pattern to ensure we're not updating during render
      setMyDonations(prevDonations => {
        return prevDonations.map(donation => {
          if (donation._id === data.donationId) {
            return {
              ...donation,
              status: data.status
            };
          }
          return donation;
        });
      });
      
      // Show appropriate notification based on status
      if (data.status === "completed") {
        toast.success(`Your donation for request #${data.requestId.slice(-5)} has been accepted! 🎉`, {
          position: "top-right",
          autoClose: 8000
        });
      } else if (data.status === "cancelled") {
        console.error(`Your donation request has been declined.`, {
          position: "top-right",
          autoClose: 5000
        });
      }
    };
  
    // Register the event handler
    socket.on('donationStatusUpdated', handleDonationStatusUpdate);
    
    // Cleanup function
    return () => {
      socket.off('donationStatusUpdated', handleDonationStatusUpdate);
    };
  }, []);
  
  // Handle user authentication and new donation requests
  useEffect(() => {
    // Fetch user data or get from cookies first
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/auth/check`, 
          { withCredentials: true }
        );
        
        if (response.data.success && response.data.user) {
          // Emit socket event with user data
          socket.emit('registerDonor', {
            userId: response.data.user._id,
            blood_group: response.data.user.blood_group,
            location: response.data.user.location
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          // Unauthorized - user not logged in
          console.error("Your session has expired. Please log in again.");
          // Optional: Redirect to login page
          // window.location.href = '/login';
        }
      }
    };
  
    // Handle new donation requests
    const handleNewDonationRequest = (donationData) => {
      // Update the donations state with the new donation using functional update
      setDonations(prevDonations => {
        // Check if this donation already exists
        const exists = prevDonations.some(d => d._id === donationData.donationId);
        if (exists) return prevDonations;
        
        // Add the new donation to the state
        const newDonation = {
          _id: donationData.donationId,
          request_id: donationData.requestInfo,
          donor_id: donationData.donorInfo,
          status: "pending"
        };
        
        // Show a notification
        toast.info(`🩸 New donation offer received from ${donationData.donorInfo?.name || 'someone'}!`, {
          position: "top-right",
          autoClose: 5000
        });
        
        return [newDonation, ...prevDonations];
      });
    };
  
    // Register event handler
    socket.on('newDonationRequest', handleNewDonationRequest);
  
    // Initialize data
    fetchUserData();
    refreshData();
    
    // Set up a refresh interval (every 2 minutes)
    const intervalId = setInterval(refreshData, 120000);
    
    // Clean up function for event listeners and intervals
    return () => {
      socket.off('newDonationRequest', handleNewDonationRequest);
      clearInterval(intervalId);
    };
  }, []);

  // Manually trigger location update
  const handleManualLocationUpdate = () => {
    updateUserLocation(
      (location) => {
        toast.success("Location updated successfully!");
        setLocationUpdated(true);
      },
      (error) => {
        console.error(`Failed to update location: ${error.message}`);
      },
      () => {
        toast.warning("Please enable location permissions to use this feature");
      }
    );
  };

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

        {/* Hero section with action buttons */}
        <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Welcome to the Blood Donation Platform</h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-2xl mx-auto">
            <div className="border-2 border-red-500 rounded-lg p-6 flex-1 flex flex-col items-center justify-center hover:bg-red-50 transition-colors bg-white shadow-sm">
              <Link to="/request" className="text-xl font-bold text-red-600 hover:text-red-700">
                Request Blood
              </Link>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Create a blood donation request for emergency needs
              </p>
            </div>
            <div className="border-2 border-blue-500 rounded-lg p-6 flex-1 flex flex-col items-center justify-center hover:bg-blue-50 transition-colors bg-white shadow-sm">
              <Link to="/donate" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                Donate Blood
              </Link>
              <p className="text-sm text-gray-600 mt-2 text-center">
                View and respond to blood requests in your area
              </p>
            </div>
          </div>
          
          {/* Location status and manual update button */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              {locationUpdated 
                ? "Your location is up to date ✓" 
                : "Location status: Not yet updated"}
            </p>
            <button 
              onClick={handleManualLocationUpdate}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Update My Location
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={refreshData}
            disabled={loading.requests || loading.receivedDonations || loading.myDonations}
            className={`${
              loading.requests || loading.receivedDonations || loading.myDonations
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded transition-colors flex items-center gap-2`}
          >
            <span>{loading.requests || loading.receivedDonations || loading.myDonations ? "Refreshing..." : "Refresh Data"}</span>
          </button>
          
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* My Donations section */}
        <MyDonations 
          myDonations={myDonations} 
          isLoading={loading.myDonations} 
        />

        <DonationRequests
          donations={donations}
          isUpdating={isUpdating}
          handleUpdateStatus={handleUpdateStatus}
          isLoading={loading.receivedDonations}
        />

        <CurrentRequests 
          userRequests={userRequests} 
          isLoading={loading.requests}
        />

        <PastRequests
          pastRequests={pastRequests}
          completedDonations={completedDonations}
          viewDonorInfo={viewDonorInfo}
          isLoading={loading.requests}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;