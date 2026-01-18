import React, { createContext, useState, useEffect, useContext } from "react";

// Helper to decode JWT token
const parseJwt = (token) => {
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

// Extract a normalized role from common JWT claim shapes
const extractRole = (decoded) => {
  if (!decoded) return null;

  const normalize = (value) => {
    const upper = String(value).toUpperCase();
    return upper.startsWith("ROLE_") ? upper.replace("ROLE_", "") : upper;
  };

  if (decoded.role) return normalize(decoded.role);

  if (Array.isArray(decoded.roles) && decoded.roles.length) {
    return normalize(decoded.roles[0]);
  }

  if (Array.isArray(decoded.authorities) && decoded.authorities.length) {
    const first = decoded.authorities[0];
    return normalize(first?.authority || first);
  }

  return null;
};

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (!token) {
      setIsLoggedIn(false);
      setUserRole(null);
      return;
    }

    const decoded = parseJwt(token);
    const isExpired = decoded?.exp && decoded.exp * 1000 < Date.now();

    if (!decoded || isExpired) {
      sessionStorage.removeItem("token");
      if (userId) sessionStorage.removeItem("userId");
      setIsLoggedIn(false);
      setUserRole(null);
      return;
    }

    const role = extractRole(decoded);
    setIsLoggedIn(true);
    setUserRole(role);
  }, []);

  const login = (token) => {
    sessionStorage.setItem("token", token);

    const decoded = parseJwt(token);
    const isExpired = decoded?.exp && decoded.exp * 1000 < Date.now();

    if (!decoded || isExpired) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      setIsLoggedIn(false);
      setUserRole(null);
      return;
    }

    const role = extractRole(decoded);

    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
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
