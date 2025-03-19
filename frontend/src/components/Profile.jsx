import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUser = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/userprofile", { withCredentials: true });
        console.log("profile:",response)

      setUser(response.data);
    } catch (err) {
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>No user data found</p>;

  return (
    <div>
      <h2>Hi, {user.email}</h2>
      <p>Name: {user.name}</p>
      <p>Phone: {user.phone}</p>
      <p>Blood Group: {user.blood_group}</p>
      <p>Location: {user.location}</p>
      <p>Health Status: {user.health_status}</p>
      <p>Last Donation Date: {user.last_donation_date || "N/A"}</p>
    </div>
  );
};

export default Profile;
