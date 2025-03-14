import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/auth/check", { withCredentials: true });
      console.log("Auth check response:", res);
      // When logged in, your endpoint should return { success: true, ... }
      if (res.status === 200 && res.data && res.data.success) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      {children}
    </AuthContext.Provider>
  );
};
