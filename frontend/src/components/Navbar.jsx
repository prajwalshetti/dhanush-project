import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/auth/logout', { withCredentials: true });

      console.log("Logged out successfully");

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
      toggle()  

  }, []);
  

  const toggle = async ()=>{
      try{
        const res = await axios.get('http://localhost:8000/api/auth/check', { withCredentials: true });
       
        console.log(res);
        if(res.status == 200)
          setIsLoggedIn(true);
      }
      catch(err)
      {
        console.log(err)
      }
  }

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b-2 border-gray-300 py-4 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo and site name */}
          <Link to="/" className="flex items-center">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
            <span className="ml-2 text-xl font-bold">BloodConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition-colors ${isActive('/') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
              Home
            </Link>
            <Link to="/request" className={`font-medium transition-colors ${isActive('/request') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
              Request Blood
            </Link>
            <Link to="/donate" className={`font-medium transition-colors ${isActive('/donate') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
              Donate
            </Link>
            <Link to="/profile" className={`font-medium transition-colors ${isActive('/profile') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
              My Profile 
            </Link>
          </div>

          {/* Login/Register & Logout Buttons */}
          <div className="hidden md:flex items-center">
          {!isLoggedIn ? (
           <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
               Login / Register
             </Link>
              ) : (
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors ml-4">
              Logout
             </button>
  )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className={`font-medium transition-colors ${isActive('/') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/request" className={`font-medium transition-colors ${isActive('/request') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`} onClick={() => setIsMenuOpen(false)}>
                Request Blood
              </Link>
              <Link to="/donate" className={`font-medium transition-colors ${isActive('/donate') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`} onClick={() => setIsMenuOpen(false)}>
                Donate
              </Link>
              <Link to="/profile" className={`font-medium transition-colors ${isActive('/profile') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`} onClick={() => setIsMenuOpen(false)}>
                My Profile
              </Link>
              {!isLoggedIn && (
              <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors w-full text-center" onClick={() => setIsMenuOpen(false)}>
                Login / Register
              </Link>
            )}

            {isLoggedIn && (
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors w-full text-center" onClick={() => setIsMenuOpen(false)}>
                Logout
              </button>
            )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
