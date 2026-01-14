import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const error = searchParams.get("error");

    if (error) {
      alert("OAuth login failed: " + error);
      navigate("/login");
      return;
    }

    if (token && userId) {
      // Store token and userId
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      
      // Update auth context
      login(token);
      
      // Redirect to home
      navigate("/home");
    } else {
      alert("Invalid OAuth callback");
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Processing login...</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
