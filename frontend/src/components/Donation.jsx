import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import socket  from "../socket";

function Donation() {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationStatus, setDonationStatus] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Combined fetch function to avoid dependency loops
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch current user
      const userResponse = await axios.get("http://localhost:8000/api/auth/check", {
        withCredentials: true,
      });
      setCurrentUser(userResponse.data.user);
      
      // 2. Fetch user's own requests to filter them out
      const userRequestsResponse = await axios.get(
        "http://localhost:8000/api/bloodrequest/user",
        { withCredentials: true }
      );
      const userRequestsData = userRequestsResponse.data || [];
      setUserRequests(userRequestsData);
      
      // 3. Fetch eligible blood requests
      const eligibleResponse = await axios.get("http://localhost:8000/api/bloodrequest/eligible", {
        withCredentials: true,
      });
      
      // Filter out user's own requests
      const allRequests = eligibleResponse.data.requests || [];
      const userRequestIds = userRequestsData.map(req => req._id);
      
      const filteredRequests = allRequests.filter(
        req => !userRequestIds.includes(req._id)
      );
      
      setBloodRequests(filteredRequests);
      
      // 4. Check if user has already requested for any of these
      const donationsResponse = await axios.get("http://localhost:8000/api/donations", {
        withCredentials: true,
      });
      
      const userDonations = donationsResponse.data.donations || [];
      const newDonationStatus = {};
      
      userDonations.forEach(donation => {
        if (donation.request_id) {
          const requestId = typeof donation.request_id === 'object' 
            ? donation.request_id._id 
            : donation.request_id;
            
          newDonationStatus[requestId] = donation.status || true;
        }
      });
      
      setDonationStatus(newDonationStatus);
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load blood requests. Please try again.");
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Single useEffect for initial data load
  useEffect(() => {

    fetchAllData();
  }, []); // Empty dependency array - only runs on mount

  useEffect(() => {
    const handleNewRequest = (newRequest) => {
      const isOwnRequest = userRequests.some(req => req._id === newRequest._id);
      if(!isOwnRequest) {
        setBloodRequests(prev => [newRequest, ...prev]);
        toast.info(`🩸 New blood request from ${newRequest.name || 'a user'} (${newRequest.blood_group})`, {
          toastId: newRequest._id,
          position: "top-right",
          autoClose: 5000
        });
      }
    };
  
    socket.on('newbloodrequest', handleNewRequest);
  
    return () => {
      socket.off("newbloodrequest", handleNewRequest);
    };
  }, [userRequests]);

  
  // Handle "Donate Now" Click
  const handleDonateNow = async (requestId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/donations/request",
        { request_id: requestId },
        { withCredentials: true }
      );

      if (response.status === 201) {
        // Update UI: Mark request as "Requested"
        setDonationStatus(prevStatus => ({
          ...prevStatus,
          [requestId]: "pending"
        }));

        socket.emit('newDonationRequest',{
          donationId : response.data.donation._id,
          requestId : requestId,
          donorInfo : response.data.donorInfo || currentUser,
          requestInfo : bloodRequests.find(req=>req._id===requestId)
        })
        
        toast.success("Donation request sent successfully! Waiting for requester to accept.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send donation request.";
      toast.error(errorMessage);
      console.error("Error sending donation request:", err);
    }
  };

  // Define button state based on donation status
  const getButtonState = (requestId) => {
    const status = donationStatus[requestId];
    
    if (!status) {
      return {
        text: "Donate Now",
        className: "bg-blue-500 text-white hover:bg-blue-600",
        disabled: false
      };
    }
    
    if (status === "pending") {
      return {
        text: "Request Pending",
        className: "bg-yellow-500 text-white cursor-not-allowed",
        disabled: true
      };
    }
    
    if (status === "completed") {
      return {
        text: "Donation Accepted",
        className: "bg-green-500 text-white cursor-not-allowed",
        disabled: true
      };
    }
    
    if (status === "cancelled") {
      return {
        text: "Request Rejected",
        className: "bg-red-500 text-white cursor-not-allowed",
        disabled: true
      };
    }
    
    return {
      text: "Request Sent",
      className: "bg-gray-400 text-white cursor-not-allowed",
      disabled: true
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold text-center my-4">
        Blood Donation Platform
      </h1>
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Available Blood Requests</h2>

        {loading && !isInitialized ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        ) : bloodRequests.length === 0 ? (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-5 rounded text-center">
            <p className="text-lg">No blood requests available matching your profile.</p>
            <p className="text-sm mt-2">Requests may be filtered based on your blood type compatibility and location.</p>
          </div>
        ) : (
          <div>
            <ul className="space-y-4">
              {bloodRequests.map((request) => {
                const buttonState = getButtonState(request._id);
                
                return (
                  <li key={request._id} className="p-4 border rounded-lg shadow-sm bg-white">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p><strong>Blood Group:</strong> <span className="text-red-600 font-semibold">{request.blood_group}</span></p>
                          <p><strong>Units Needed:</strong> {request.units_needed}</p>
                          <p><strong>City:</strong> {request.location}</p>
                          <p><strong>Urgency:</strong> 
                            <span className={`ml-1 ${
                              request.urgency === "High" ? "text-red-600" : 
                              request.urgency === "Medium" ? "text-yellow-600" : 
                              "text-green-600"
                            }`}>
                              {request.urgency || "Normal"}
                            </span>
                          </p>
                        </div>
                        {request.additional_info && (
                          <p className="mt-2"><strong>Additional Info:</strong> {request.additional_info}</p>
                        )}
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg transition-colors ${buttonState.className}`}
                        onClick={() => handleDonateNow(request._id)}
                        disabled={buttonState.disabled}
                      >
                        {buttonState.text}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 text-center">
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => {
                  setLoading(true);
                  fetchAllData();
                }}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh Requests"}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Donation;