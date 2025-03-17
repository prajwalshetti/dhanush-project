import React, { useState, useEffect } from "react";
import axios from "axios";

function Donation() {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationStatus, setDonationStatus] = useState({});

  // Fetch Eligible Blood Requests
  const fetchBloodRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/bloodrequest/eligible", {
        withCredentials: true,
      });
      setBloodRequests(response.data.requests);
      
      // Check if user has already requested for any of these
      checkExistingDonations(response.data.requests);
    } catch (err) {
      console.error("Error fetching blood requests:", err);
      setError("Failed to load blood requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user has already requested for any blood requests
  const checkExistingDonations = async (requests) => {
    try {
      const response = await axios.get("http://localhost:8000/api/donations", {
        withCredentials: true,
      });
      
      const userDonations = response.data.donations;
      const newDonationStatus = {};
      
      // Create a map of request_id to donation status
      userDonations.forEach(donation => {
        if (donation.request_id) {
          newDonationStatus[donation.request_id._id] = true;
        }
      });
      
      setDonationStatus(newDonationStatus);
    } catch (err) {
      console.error("Error checking existing donations:", err);
    }
  };

  useEffect(() => {
    fetchBloodRequests();
  }, []);

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
          [requestId]: true
        }));
        
        alert("Donation request sent successfully! Waiting for requester to accept.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send donation request.";
      alert(errorMessage);
      console.error("Error sending donation request:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Available Blood Requests</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : bloodRequests.length === 0 ? (
        <p className="text-center text-gray-600">No blood requests available.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {bloodRequests.map((request) => (
              <li key={request._id} className="p-4 border rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Blood Group:</strong> {request.blood_group}</p>
                    <p><strong>Units Needed:</strong> {request.units_needed}</p>
                    <p><strong>City:</strong> {request.location}</p>
                    <p><strong>Status:</strong> <span className="text-blue-600">{request.status}</span></p>
                    <p><strong>Urgency:</strong> {request.urgency || "Normal"}</p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      donationStatus[request._id]
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => handleDonateNow(request._id)}
                    disabled={donationStatus[request._id]}
                  >
                    {donationStatus[request._id] ? "Request Sent" : "Donate Now"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-center">
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={fetchBloodRequests}
            >
              Refresh Requests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Donation;