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
  
  // Fetch user requests
  const fetchUserRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bloodrequest/user", {
        withCredentials: true,
      });
      const requests = response.data;

      // Filter active and past requests
      const activeRequests = requests.filter(req => req.status === 'pending');
      const pastRequests = requests.filter(req => req.status === 'fullfilled');

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
      setDonations(response.data.donations);
    } catch (err) {
      console.error("Error fetching received donations:", err);
    }
  };

  // Update donation status
  const handleUpdateStatus = async (donationId, status) => {
    setIsUpdating(true);
    try {
      await axios.put(
        `http://localhost:8000/api/donations/update/${donationId}`, 
        { status }, // Payload key remains 'status'
        { withCredentials: true }
      );
      
      // Refresh donations list after update
      await fetchReceivedDonations();
    } catch (err) {
      console.error("Error updating donation status:", err);
      alert("Failed to update donation status. Please try again.");
    } finally {
      setIsUpdating(false);
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
              {donations.map((donation) => (
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
                        onClick={() => handleUpdateStatus(donation._id, "completed")}
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
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
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
                        request.status === 'fullfilled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{request.createdAt}</span>
                    </div>
                  </div>
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
