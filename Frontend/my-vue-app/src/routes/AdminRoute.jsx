import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      return <Navigate to="/login" />;
    }

    const roleRaw = decoded.role || decoded.roles?.[0] || decoded.authorities?.[0]?.authority || decoded.authorities?.[0];
    const role = String(roleRaw || "").toUpperCase();
    const normalizedRole = role.startsWith("ROLE_") ? role.replace("ROLE_", "") : role;

    if (normalizedRole !== "ADMIN") {
      return <Navigate to="/unauthorized" />;
    }

    return children; // show page if admin
  } catch (error) {
    console.error("Invalid token:", error);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
