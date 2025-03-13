import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Home = () => {
  // State management
  const [userRequests, setUserRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const [hasActiveRequests, setHasActiveRequests] = useState(false);
  
  // Simulate fetching user requests from API
  useEffect(() => {
    // Mock data - in a real app, fetch from backend
    const mockCurrentRequests = [
      { id: 1, bloodType: 'O+', location: 'City Hospital', status: 'active', createdAt: '2025-03-10' }
    ];
    
    const mockPastRequests = [
      { id: 2, bloodType: 'AB-', location: 'Medical Center', status: 'completed', createdAt: '2025-02-25' },
      { id: 3, bloodType: 'B+', location: 'Regional Hospital', status: 'cancelled', createdAt: '2025-02-15' }
    ];
    
    setUserRequests(mockCurrentRequests);
    setPastRequests(mockPastRequests);
    setHasActiveRequests(mockCurrentRequests.length > 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with title */}
      <h1 className="text-3xl font-bold text-center my-4">Blood Donation & Emergency Platform</h1>
      
      {/* Navbar */}
      {/* <div className="border-b-2 border-gray-300 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-center mb-2">Navbar</h2>
        <div className="w-full border-t border-gray-300"></div>
      </div> */}
      <Navbar/>


      {/* Main content area */}
      <div className="flex-grow px-4">
        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Request Blood Button */}
          <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            <Link to="/request" className="text-xl font-bold">Request</Link>
            <p className="text-sm text-gray-600 mt-2">Request blood donation</p>
          </div>
          
          {/* Donate Blood Button */}
          <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            <Link to="/donate" className="text-xl font-bold">Donate</Link>
            <p className="text-sm text-gray-600 mt-2">Register to donate blood</p>
          </div>
          
          {/* Available Donors (conditional) */}
          {hasActiveRequests && (
            <div className="border-2 border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <Link to="/donors" className="text-xl font-bold">Available Donors</Link>
              <p className="text-sm text-gray-600 mt-2">View donors for your requests</p>
            </div>
          )}
        </div>
        
        {/* Current Requests Section */}
        <div className="border-t-2 border-gray-300 py-3 mb-4">
          <h2 className="text-xl font-semibold mb-2">Current Request</h2>
          
          {userRequests.length > 0 ? (
            <div className="bg-white rounded-lg p-4 shadow-md">
              {userRequests.map(request => (
                <div key={request.id} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold mr-2">Blood Type: {request.bloodType}</span>
                      <span className="text-gray-600">{request.location}</span>
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
                <div key={request.id} className="mb-2 last:mb-0 p-2 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold mr-2">Blood Type: {request.bloodType}</span>
                      <span className="text-gray-600">{request.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        request.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
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
      
      {/* Footer */}
      <div className="border-t-2 border-gray-300 py-3 mt-auto">
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-2">Footer</h2>
          <p className="text-sm">© 2025 Blood Donation Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;