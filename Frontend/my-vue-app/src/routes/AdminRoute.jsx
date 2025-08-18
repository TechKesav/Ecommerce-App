import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "ADMIN") {
      // redirect to unauthorized page instead of blank
      return <Navigate to="/unauthorized" />;
    }

    return children; // ✅ show page if admin
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
