import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [statistics, setStatistics] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    totalRequests: 0,
    activeRequests: 0,
    fulfilledRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const userResponse = await axios.get(
          "http://localhost:8000/api/user/profile",
          { withCredentials: true }
        );
        
        // console.log("userInfo : ",userResponse)
        const userData = userResponse.data;
        // console.log("userInfo : ",userData)
        setUser(userData);
        setUpdatedUser(userData);
        
        // Fetch user donations
        const donationsResponse = await axios.get(
          "http://localhost:8000/api/donations",
          { withCredentials: true }
        );
        
        const donationsData = donationsResponse.data.donations || [];
        setDonations(donationsData);
        
        // Fetch user blood requests
        const requestsResponse = await axios.get(
          "http://localhost:8000/api/bloodrequest/user",
          { withCredentials: true }
        );
        
        const requestsData = requestsResponse.data || [];
        setRequests(requestsData);
        
        // Calculate statistics
        const pendingDonations = donationsData.filter(d => d.status === "pending").length;
        const completedDonations = donationsData.filter(d => d.status === "completed").length;
        const activeRequests = requestsData.filter(r => r.status === "pending").length;
        const fulfilledRequests = requestsData.filter(r => r.status === "fulfilled").length;
        
        setStatistics({
          totalDonations: donationsData.length,
          pendingDonations,
          completedDonations,
          totalRequests: requestsData.length,
          activeRequests,
          fulfilledRequests
        });
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle user info updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:8000/api/user/update",
        updatedUser,
        { withCredentials: true }
      );


      console.log("updated info : ",response)
      
      if (response.status===200) {
        setUser(updatedUser);
        setEditMode(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };
  
  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    
    try {
      const response = await axios.put(
        "http://localhost:8000/api/user/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword : passwordForm.confirmPassword
        },
        { withCredentials: true }
      );


      console.log("updated password : ",response)
      
      if (response.status===200) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setShowPasswordForm(false);
        toast.success("Password changed successfully!");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="spinner-border text-red-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="ml-2">Loading profile data...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Calculate badge level based on donations
  const getBadgeInfo = () => {
    const completedCount = statistics.completedDonations;
    
    if (completedCount >= 20) {
      return { name: "Platinum Donor", color: "bg-gray-200", textColor: "text-gray-800" };
    } else if (completedCount >= 10) {
      return { name: "Gold Donor", color: "bg-yellow-500", textColor: "text-yellow-900" };
    } else if (completedCount >= 5) {
      return { name: "Silver Donor", color: "bg-gray-300", textColor: "text-gray-700" };
    } else if (completedCount >= 1) {
      return { name: "Bronze Donor", color: "bg-orange-600", textColor: "text-orange-100" };
    } else {
      return { name: "New Donor", color: "bg-blue-500", textColor: "text-white" };
    }
  };
  
  const badgeInfo = getBadgeInfo();
  
  // Calculate eligibility date (3 months from last donation if any)
  const getNextEligibleDate = () => {
    const completedDonations = donations.filter(d => d.status === "completed");
    if (completedDonations.length === 0) return "Eligible now";
    
    // Sort by date and get the most recent
    completedDonations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const lastDonation = completedDonations[0];
    
    // Calculate eligibility (3 months after last donation)
    const lastDonationDate = new Date(lastDonation.updatedAt);
    const eligibleDate = new Date(lastDonationDate);
    eligibleDate.setMonth(eligibleDate.getMonth() + 3);
    
    const today = new Date();
    if (today >= eligibleDate) {
      return "Eligible now";
    } else {
      return `Eligible on ${eligibleDate.toLocaleDateString()}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600">My Profile</h1>
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <button 
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        
        {/* Profile and Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-red-600">{user?.name?.charAt(0) || "U"}</span>
                </div>
                <h2 className="text-2xl font-semibold">{user?.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeInfo.color} ${badgeInfo.textColor} mt-2`}>
                  {badgeInfo.name}
                </span>
              </div>
              
              {!editMode ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-semibold text-lg text-red-600">{user?.blood_group}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{user?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{user?.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Eligible Donation</p>
                    <p className="font-semibold">{getNextEligibleDate()}</p>
                  </div>
                  <div className="pt-3">
                    <button 
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      {showPasswordForm ? "Hide Password Form" : "Change Password"}
                    </button>
                    
                    {showPasswordForm && (
                      <form onSubmit={updatePassword} className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Update Password
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={updateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <select
                      name="blood_group"
                      value={updatedUser.blood_group || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={updatedUser.phone || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={updatedUser.location || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Statistics Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Blood Donation Stats</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Donations</p>
                  <p className="text-3xl font-bold text-red-600">{statistics.totalDonations}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Pending Donations</p>
                  <p className="text-3xl font-bold text-yellow-600">{statistics.pendingDonations}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Completed Donations</p>
                  <p className="text-3xl font-bold text-green-600">{statistics.completedDonations}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Requests</p>
                  <p className="text-3xl font-bold text-blue-600">{statistics.totalRequests}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Active Requests</p>
                  <p className="text-3xl font-bold text-purple-600">{statistics.activeRequests}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Fulfilled Requests</p>
                  <p className="text-3xl font-bold text-indigo-600">{statistics.fulfilledRequests}</p>
                </div>
              </div>
              
              {/* Donation Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Progress to Next Badge</h3>
                  <span className="text-sm text-gray-500">
                    {statistics.completedDonations} / {statistics.completedDonations >= 20 ? "∞" : 
                     statistics.completedDonations >= 10 ? "20" : 
                     statistics.completedDonations >= 5 ? "10" : 
                     statistics.completedDonations >= 1 ? "5" : "1"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${statistics.completedDonations >= 20 ? 100 : 
                              statistics.completedDonations >= 10 ? (statistics.completedDonations / 20) * 100 : 
                              statistics.completedDonations >= 5 ? (statistics.completedDonations / 10) * 100 : 
                              statistics.completedDonations >= 1 ? (statistics.completedDonations / 5) * 100 : 
                              (statistics.completedDonations / 1) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {statistics.completedDonations >= 20 ? "Congratulations! You've reached the highest donor level." : 
                   statistics.completedDonations >= 10 ? `${20 - statistics.completedDonations} more donations to Platinum level` : 
                   statistics.completedDonations >= 5 ? `${10 - statistics.completedDonations} more donations to Gold level` : 
                   statistics.completedDonations >= 1 ? `${5 - statistics.completedDonations} more donations to Silver level` : 
                   "1 donation needed to reach Bronze level"}
                </p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                {[...donations, ...requests]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((item, index) => {
                    const isRequest = item.units_needed !== undefined;
                    const date = new Date(item.createdAt).toLocaleDateString();
                    
                    return (
                      <div key={index} className="border-l-4 pl-4 py-2" style={{
                        borderColor: isRequest ? 
                                    (item.status === "fulfilled" ? "#10B981" : 
                                     item.status === "cancelled" ? "#EF4444" : "#3B82F6") : 
                                    (item.status === "completed" ? "#10B981" : 
                                     item.status === "cancelled" ? "#EF4444" : "#F59E0B")
                      }}>
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {isRequest ? `Blood Request (${item.blood_group})` : `Donation (${item.request_id?.blood_group || "Unknown"})`}
                          </p>
                          <span className="text-sm text-gray-500">{date}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {isRequest ? 
                            `Status: ${item.status.charAt(0).toUpperCase() + item.status.slice(1)} • ${item.units_needed} units` :
                            `Status: ${item.status.charAt(0).toUpperCase() + item.status.slice(1)} • To: ${item.requester_id?.name || "Unknown"}`
                          }
                        </p>
                      </div>
                    );
                  })
                }
                
                {[...donations, ...requests].length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
              
              <div className="mt-6 flex space-x-4">
                <Link to="/donate" className="flex-1">
                  <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Donate Blood
                  </button>
                </Link>
                <Link to="/request" className="flex-1">
                  <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Request Blood
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;