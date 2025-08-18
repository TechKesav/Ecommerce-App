import { useEffect, useState } from "react";
import axios from "axios";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateData, setUpdateData] = useState({ name: "", email: "", phone: "" });

  const token = localStorage.getItem("token"); 

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUpdateData({ name: user.name, email: user.email, phone: user.phone });
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(
        `http://localhost:8080/api/users/${selectedUser.id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully!");
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-black p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`p-2 rounded cursor-pointer ${selectedUser?.id === user.id ? "bg-gray-700" : "hover:bg-gray-700"}`}
              onClick={() => handleUserClick(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedUser ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Manage User</h2>
            <div className="mb-3">
              <label className="block text-sm">Name</label>
              <input
                type="text"
                value={updateData.name}
                onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm">Email</label>
              <input
                type="email"
                value={updateData.email}
                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm">Phone</label>
              <input
                type="text"
                value={updateData.phone}
                onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        ) : (
          <p className="text-gray-600">Select a user from the sidebar to manage.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
