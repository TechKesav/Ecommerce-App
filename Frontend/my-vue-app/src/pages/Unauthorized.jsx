// src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
   return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center px-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-100 mb-2">
        Unauthorized Access
      </h2>
      <p className="text-gray-400 mb-6">
        Sorry, you don’t have permission to view this page.
      </p>

      <div className="flex gap-4">
        <Link
          to="/"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
        <Link
          to="/login"
          className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
