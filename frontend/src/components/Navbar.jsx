import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const base_url = import.meta.env.VITE_BASE_URL

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${base_url}/api/auth/check`, { withCredentials: true });
      setIsLoggedIn(res.status === 200);
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${base_url}/api/auth/logout`, { withCredentials: true });
      console.log("Logged out successfully");
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  // Navigation links data for DRY code
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/request', label: 'Request Blood' },
    { path: '/donate', label: 'Donate' },
    { path: '/profile', label: 'My Profile' },
    { 
      path: '/aiagent', 
      label: 'AI Assistant',
      icon: (
        <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      )
    }
  ];

  return (
    <nav className="bg-white shadow-md border-b-2 border-gray-200 py-4 px-4 md:px-8 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo and site name */}
          <Link to="/" className="flex items-center group">
            <svg className="w-8 h-8 text-red-600 group-hover:text-red-700 transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">BloodConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`font-medium transition-colors relative ${
                  isActive(link.path) 
                    ? 'text-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {link.icon && link.icon}
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform -translate-y-1"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Login/Register & Logout Buttons */}
          <div className="hidden md:flex items-center">
            {isLoading ? (
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : !isLoggedIn ? (
              <Link to="/login" className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow-md">
                Login / Register
              </Link>
            ) : (
              <button 
                onClick={handleLogout} 
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow-md flex items-center"
              >
                <span>Logout</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 focus:outline-none p-2 rounded-md transition-colors hover:bg-red-50"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`font-medium transition-colors px-4 py-2 rounded-md ${
                    isActive(link.path) 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  } flex items-center`} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon && React.cloneElement(link.icon, { className: "w-5 h-5 mr-2" })}
                  {link.label}
                </Link>
              ))}
              
              {!isLoading && (
                !isLoggedIn ? (
                  <Link 
                    to="/login" 
                    className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors w-full text-center mt-2 shadow-sm" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                ) : (
                  <button 
                    onClick={(e) => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors w-full text-center mt-2 shadow-sm flex items-center justify-center"
                  >
                    <span>Logout</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;