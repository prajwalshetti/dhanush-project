import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import Footer from './Footer';

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
      const response = await axios.get("http://localhost:8000/api/bloodrequest/user", {
        withCredentials: true,
      });
      const requests = response.data;

      // Filter active and past requests
      const activeRequests = requests.filter(req => req.status === 'pending');
      const pastRequests = requests.filter(req => req.status === 'fulfilled' || req.status === 'cancelled');

      setUserRequests(activeRequests);
      setPastRequests(pastRequests);
      setHasActiveRequests(activeRequests.length > 0);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
    }
  };

  // Fetch received donations
  const fetchReceivedDonations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bloodrequest/donations-received", {
        withCredentials: true,
      });
      
      const donationsData = response.data.donations || [];
      setDonations(donationsData);
      
      // Create a map of completed donations to easily find donor info for past requests
      const completedDonationsMap = {};
      donationsData.forEach(donation => {
        if (donation.status === 'completed' && donation.request_id) {
          completedDonationsMap[donation.request_id._id] = donation;
        }
      });
      setCompletedDonations(completedDonationsMap);
    } catch (err) {
      console.error("Error fetching received donations:", err);
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
        const requestResponse = await axios.patch(
          `http://localhost:8000/api/bloodrequest/${requestId}/status`,
          { status: "fulfilled" },
          { withCredentials: true }
        );
        
        // Store donor information for viewing later
        if (donationResponse.data.donorInfo) {
          setCurrentDonorInfo({
            donation: donationResponse.data.donation,
            donor: donationResponse.data.donorInfo,
            requester: donationResponse.data.requesterInfo
          });
          setShowDonorInfo(true);
        }
      }
      
      // Refresh data after updates
      await fetchUserRequests();
      await fetchReceivedDonations();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
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
        requester: { request: donation.request_id }
      });
      setShowDonorInfo(true);
    } else {
      alert("Donor information not available");
    }
  };

  useEffect(() => {
    fetchUserRequests();
    fetchReceivedDonations();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold text-center my-4">
        Blood Donation & Emergency Platform
      </h1>
      <Navbar/>
      <div className="flex-grow px-4">
        {/* Donor Info Modal */}
        {showDonorInfo && currentDonorInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-green-600">Donation Information</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Donor Information</h3>
                <p><span className="font-medium">Name:</span> {currentDonorInfo.donor.name}</p>
                <p><span className="font-medium">Email:</span> {currentDonorInfo.donor.email}</p>
                <p><span className="font-medium">Phone:</span> {currentDonorInfo.donor.phone || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Request Details</h3>
                <p><span className="font-medium">Blood Group:</span> {currentDonorInfo.donation.request_id?.blood_group || 'N/A'}</p>
                <p><span className="font-medium">Status:</span> {currentDonorInfo.donation.status}</p>
              </div>
              <div className="text-right">
                <button 
                  onClick={() => setShowDonorInfo(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            <Link to="/request" className="text-xl font-bold">Request</Link>
            <p className="text-sm text-gray-600 mt-2">Request blood donation</p>
          </div>
          <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            <Link to="/donate" className="text-xl font-bold">Donate</Link>
            <p className="text-sm text-gray-600 mt-2">Register to donate blood</p>
          </div>
          {hasActiveRequests && (
            <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <Link to="/donors" className="text-xl font-bold">Available Donors</Link>
              <p className="text-sm text-gray-600 mt-2">View donors for your requests</p>
            </div>
          )}
        </div>

        {/* Donation requests received */}
        <div className="border-t-2 border-gray-300 py-3 mb-4">
          <h2 className="text-xl font-semibold mb-2">Received Donation Requests</h2>
          {donations.length === 0 ? (
            <p className="text-gray-600">No donation requests received yet.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md">
              {donations.filter(d => d.status === 'pending').map((donation) => (
                <div key={donation._id} className="p-4 border-b last:border-b-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="mb-1">
                        <span className="font-semibold">Donor:</span> {donation.donor_id.name}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Email:</span> {donation.donor_id.email}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Phone:</span> {donation.donor_id.phone}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1">
                        <span className="font-semibold">Blood Group:</span> {donation.request_id.blood_group}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Units Needed:</span> {donation.request_id.units_needed}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {donation.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  {donation.status === "pending" && (
                    <div className="mt-3 flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(donation._id, "completed", donation.request_id._id)}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(donation._id, "cancelled")}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Current Requests Section */}
        <div className="border-t-2 border-gray-300 py-3 mb-4">
          <h2 className="text-xl font-semibold mb-2">Current Request</h2>
          {userRequests.length > 0 ? (
            <div className="bg-white rounded-lg p-4 shadow-md">
              {userRequests.map(request => (
                <div key={request._id} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold mr-2">Blood Type: {request.blood_group}</span>
                      <span className="text-gray-600">Location: {request.location}</span>
                    </div>
                    <div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You have no active requests.</p>
          )}
        </div>
        
        {/* Past Requests Section */}
        <div className="border-t-2 border-gray-300 py-3 mb-4">
          <h2 className="text-xl font-semibold mb-2">Past Requests</h2>
          {pastRequests.length > 0 ? (
            <div className="bg-white rounded-lg p-4 shadow-md">
              {pastRequests.map(request => (
                <div key={request._id} className="mb-2 last:mb-0 p-2 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold mr-2">Blood Type: {request.blood_group}</span>
                      <span className="text-gray-600">Location: {request.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        request.status === 'fulfilled'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {request.status === 'fulfilled' && completedDonations[request._id] && (
                    <div className="mt-2">
                      <button
                        onClick={() => viewDonorInfo(request._id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        View Donor Info
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You have no past requests.</p>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;