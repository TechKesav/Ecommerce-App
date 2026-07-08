import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config";

// helper to decode JWT token
const parseJwt = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

const UserPage = () => {
  const [users, setUsers] = useState([]); // This can store one or more user objects
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updateData, setUpdateData] = useState({ name: "", email: "", phone: "", password: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId"); // JWT from login

  // Determine user role from the token
  const jwtPayload = parseJwt(token);
  const userRole = jwtPayload?.role ? String(jwtPayload.role).toUpperCase() : null;

  useEffect(() => {
    if (!token || !userId) return; // Ensure you have a token and userId
    
    // Fetch only the logged-in user's details (for both admin and regular users)
    axios
      .get(apiUrl(`/api/users/${userId}`), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers([res.data]); // Place the single user in an array for consistency
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, [token, userId]);

  // Open sidebar with user details
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUpdateData({ name: user.name, email: user.email, phone: user.phone, password: "" });
    setSidebarOpen(true);
  };

  // Update user
  const handleUpdate = async () => {
    // Prevent multiple clicks
    if (isUpdating) return;

    // Validate password is provided
    if (!updateData.password || updateData.password.trim() === "") {
      alert("⚠️ Password is required to update user details");
      return;
    }

    setIsUpdating(true);

    try {
      const emailChanged = selectedUser.email !== updateData.email;
      
      const response = await axios.put(
        apiUrl(`/api/users/${selectedUser.id}`),
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("✅ User updated successfully!");
      
      // If email changed, redirect to login since token is now invalid
      if (emailChanged) {
        alert("📧 Email changed! Please log in again with your new email: " + updateData.email);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        navigate("/login");
        return;
      }
      
      // Refresh user data if email didn't change
      axios
        .get(apiUrl(`/api/users/${userId}`), {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsers([res.data]);
          setSelectedUser(res.data);
          setUpdateData({ name: res.data.name, email: res.data.email, phone: res.data.phone, password: "" });
        })
        .catch((err) => console.error("Error fetching user details:", err));
      setSidebarOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Error updating user";
      alert(`❌ Error: ${errorMessage}`);
      console.error("Error updating user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete user (likely admin-only action)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(apiUrl(`/api/users/${selectedUser.id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully!");
      setSidebarOpen(false);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Error deleting user";
      alert(`Error: ${errorMessage}`);
      console.error("Error deleting user:", error);
    }
  };

return (
  <div className="flex h-screen bg-gray-900 text-gray-200">
    {/* Sidebar List */}
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">
        My Profile
      </h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 hover:bg-gray-700 cursor-pointer rounded"
            onClick={() => handleUserClick(user)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>

    {/* User Info Drawer */}
    {sidebarOpen && (
      <div className="fixed top-0 right-0 w-80 h-full bg-gray-800 shadow-lg p-6 z-50 text-white">
        <button
          className="mb-4 text-red-400 font-bold hover:text-red-500"
          onClick={() => setSidebarOpen(false)}
        >
          Close
        </button>
        <h3 className="text-lg font-bold mb-2">User Details</h3>
        <div className="mb-3">
          <label className="block text-sm text-gray-300">Name</label>
          <input
            type="text"
            value={updateData.name}
            onChange={(e) =>
              setUpdateData({ ...updateData, name: e.target.value })
            }
            className="border border-gray-600 bg-gray-700 p-2 w-full rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-300">Email</label>
          <input
            type="email"
            value={updateData.email}
            onChange={(e) =>
              setUpdateData({ ...updateData, email: e.target.value })
            }
            className="border border-gray-600 bg-gray-700 p-2 w-full rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-300">Phone</label>
          <input
            type="text"
            value={updateData.phone}
            onChange={(e) =>
              setUpdateData({ ...updateData, phone: e.target.value })
            }
            className="border border-gray-600 bg-gray-700 p-2 w-full rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-300">
            Password (Required) <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            value={updateData.password}
            onChange={(e) =>
              setUpdateData({ ...updateData, password: e.target.value })
            }
            placeholder="Enter your current password"
            className="border border-gray-600 bg-gray-700 p-2 w-full rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            ⚠️ Required for security verification
          </p>
        </div>
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className={`px-4 py-2 rounded mr-2 transition-colors ${
            isUpdating 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isUpdating ? '⏳ Updating...' : 'Update'}
        </button>

      </div>
    )}
  </div>
);
};

export default UserPage;
