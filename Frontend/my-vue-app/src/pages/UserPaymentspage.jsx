import { useEffect, useState } from "react";
import axios from "axios";

const UserPaymentsPage = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // logged-in user's ID

  useEffect(() => {
    if (!token || !userId) return;

    axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => {
      console.error("Error fetching user orders:", err);
      if (err.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      }
    });
  }, [token, userId]);

  // Function to pick color based on status
  const getStatusColor = (status) => {
    switch(status) {
      case "SUCCESS": return "bg-green-100 text-green-800";
      case "FAILED": return "bg-red-100 text-red-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
  <div className="min-h-screen bg-black flex flex-col items-center pt-16 px-4">
    {/* Title */}
    <h2 className="text-4xl font-bold mb-12 text-white text-center">My Payments</h2>

    {/* Payments Card */}
    {orders.length === 0 ? (
      <p className="text-gray-400 text-center">No payments found.</p>
    ) : (
      <div className="flex flex-col items-center w-full max-w-md">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-900 shadow-lg rounded-xl p-6 mb-6 w-full text-center"
          >
            <p className="text-white mb-2">
              <span className="font-medium">Amount:</span> {(order.amount / 100).toFixed(2)} {order.currency}
            </p>
            <p className="text-white mb-4">
              <span className="font-medium">Order ID:</span> {order.razorpayOrderId}
            </p>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                order.paymentStatus === "SUCCESS"
                  ? "bg-green-100 text-green-800"
                  : order.paymentStatus === "FAILED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default UserPaymentsPage;
