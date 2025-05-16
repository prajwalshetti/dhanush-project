import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login.jsx'
import Register from './components/Register.jsx';
import Home from './components/Home.jsx';
import RequestForm from './components/RequestForm.jsx';
import Donation from './components/Donation.jsx';
import Profile from './components/Profile.jsx';
import AIAgent from './components/AIAgent.jsx';

const base_url = import.meta.env.VITE_BASE_URL

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${base_url}/api/auth/check`,
          { withCredentials: true }
        );
        
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log('Not authenticated:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request" element={<RequestForm user={user} />} />
        <Route path="/donate" element={<Donation user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/aiagent" element={<AIAgent/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
