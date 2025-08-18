import React, { useState } from "react";
import { login as loginApi } from "../api/auth"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const user = { email, password };
    const res = await loginApi(user);

    console.log("Full API Response:", res);
    const token = res.data;

    if (!token) {
      console.error("No token found in response:", res.data);
      alert("No token received from server");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    if (!userId) {
      alert("Unable to extract user ID from token");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    login(token); 

    alert("Login successful");
    navigate("/home");
  } catch (error) {
  console.error("Login Error:", error.response || error);

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 429) {
      alert(data.error || "Too many login attempts. Try again later.");
      setIsDisabled(true); 
      setTimeout(() => {
        setIsDisabled(false);
      }, 30000); 
    } else if (status === 401) {
      alert(data.error || "Invalid email or password.");
    } else {
      alert(data.error || "Login failed. Please try again.");
    }
  } else {
    alert("Server unreachable. Please check your network.");
  }
}
};

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black">
    <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-96 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <input
          type="email"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full p-3 rounded-lg font-semibold ${
            isDisabled ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isDisabled ? "Please wait..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  </div>
);
};

export default Login;
