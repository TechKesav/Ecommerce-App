import { useEffect, useState } from "react";
import axios from "axios";

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
  const [updateData, setUpdateData] = useState({ name: "", email: "", phone: "" });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId") // JWT from login

  // Determine user role from the token
  const jwtPayload = parseJwt(token);
  const userRole = jwtPayload?.role;

  useEffect(() => {
    if (!token) return; // Ensure you have a token
    if (userRole === "admin") {
      // If admin, fetch all users
      axios
        .get("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));
    } else {
      // For a regular user, fetch only the details of the logged-in user
      axios
        .get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsers([res.data]); // Place the single user in an array for consistency
        })
        .catch((err) => console.error("Error fetching user details:", err));
    }
  }, [token, userRole]);

  // Open sidebar with user details
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUpdateData({ name: user.name, email: user.email, phone: user.phone });
    setSidebarOpen(true);
  };

  // Update user
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/users/${selectedUser.id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User updated successfully!");
      setSidebarOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete user (likely admin-only action)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully!");
      setSidebarOpen(false);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

return (
  <div className="flex h-screen bg-gray-900 text-gray-200">
    {/* Sidebar List */}
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">
        {userRole === "admin" ? "Users" : "My Profile"}
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
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
        >
          Update
        </button>
        {userRole === "admin" && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    )}
  </div>
);
};

export default UserPage;
