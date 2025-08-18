import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }

      setIsAuthenticated(true);

      let role = null;

      if (decoded.role) {
        role = decoded.role;
      } else if (decoded.roles && Array.isArray(decoded.roles)) {
        role = decoded.roles[0]; // take first role
      } else if (decoded.authorities && Array.isArray(decoded.authorities)) {
        role = decoded.authorities[0]?.authority || decoded.authorities[0];
      }

      if (role === "ADMIN" || role === "ROLE_ADMIN") {
        setIsAdmin(true);
      }
    } catch (e) {
      console.error("JWT decode failed:", e);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  return { isAuthenticated, isAdmin };
};

export default useAuth;
