import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token in ProtectedRoute:", error);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
