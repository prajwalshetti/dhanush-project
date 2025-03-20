import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/userprofile", { withCredentials: true });
      console.log("User data:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      console.log("Uploading file:", file.name);
      
      // Log the formData to make sure it's created correctly
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const { data } = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
        timeout: 30000 // 30 seconds timeout
      });

      console.log("Upload response:", data);
      
      if (data && data.imageUrl) {
        // Refresh user data instead of manually updating state
        await getUser();
        
        console.log("User data refreshed after upload");
      } else {
        console.error("Invalid response data:", data);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Upload error details:", error);
      console.error("Response data:", error.response?.data);
      alert("Error uploading image: " + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <p className="text-center text-gray-500">No user data found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 p-6 flex flex-col items-center border-r">
        <img
          src={user.profilePicture ? `http://localhost:8000/uploads/${user.profilePicture}` : "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
        />
        <p className="mt-3 text-lg font-semibold text-gray-800">{user.name}</p>
        <input type="file" onChange={uploadFileHandler} accept="image/*" className="mt-3 text-sm text-gray-600" />
        {uploading && <p className="text-xs text-red-500 mt-2">Uploading...</p>}
      </div>

      {/* User Info */}
      <div className="w-2/3 p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Hi, {user.email}</h2>
        <div className="mt-4 space-y-2 text-gray-700">
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Blood Group:</strong> {user.blood_group}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Health Status:</strong> {user.health_status}</p>
          <p><strong>Last Donation Date:</strong> {user.last_donation_date || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;