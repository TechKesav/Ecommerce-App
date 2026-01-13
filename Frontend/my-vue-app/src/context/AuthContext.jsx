import React, { createContext, useState, useEffect, useContext } from "react";

// Helper to decode JWT token
const parseJwt = (token) => {
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    console.log("Decoded Token:", decoded); // Debug log
    return decoded;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log
    setIsLoggedIn(!!token);
    
    if (token) {
      const decoded = parseJwt(token);
      console.log("User Role from token:", decoded?.role); // Debug log
      setUserRole(decoded?.role || null);
    } else {
      setUserRole(null);
    }
  }, []);

  const login = (token) => {
    console.log("Logging in with token:", token); // Debug log
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    
    const decoded = parseJwt(token);
    console.log("User Role after login:", decoded?.role); // Debug log
    setUserRole(decoded?.role || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
