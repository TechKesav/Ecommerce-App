import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { apiUrl } from "../config";

const UserPaymentsPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId"); // logged-in user's ID

  useEffect(() => {
    if (!token || !userId) return;

    axios.get(apiUrl(`/api/orders/user/${userId}`), {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Sort by date (most recent first) and limit to 10
      const sortedOrders = res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setOrders(sortedOrders);
    })
    .catch(err => {
      console.error("Error fetching user orders:", err);
      if (err.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      }
    });
  }, [token, userId]);

  // Filter orders based on selected status
  const filteredOrders = selectedFilter === "ALL" 
    ? orders 
    : orders.filter(order => order.paymentStatus === selectedFilter);

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "SUCCESS":
        return <FaCheckCircle style={{ color: "#4CAF50", fontSize: "24px" }} />;
      case "FAILED":
        return <FaTimesCircle style={{ color: "#F44336", fontSize: "24px" }} />;
      case "PENDING":
        return <FaClock style={{ color: "#FFC107", fontSize: "24px" }} />;
      default:
        return null;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "SUCCESS": return "#4CAF50";
      case "FAILED": return "#F44336";
      case "PENDING": return "#FFC107";
      default: return "#888";
    }
  };

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "40px 20px" }}>
      {/* Title */}
      <h2 style={{ 
        fontSize: "28px", 
        fontWeight: "bold", 
        color: "white", 
        marginBottom: "30px",
        textAlign: "center"
      }}>
        My Payments
      </h2>

      {/* Filter Buttons */}
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto 30px",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        {["ALL", "SUCCESS", "PENDING", "FAILED"].map((status) => {
          let bgColor = "#333";
          let textColor = "#aaa";
          let borderColor = "#444";

          if (selectedFilter === status) {
            if (status === "SUCCESS") {
              bgColor = "#4CAF50";
              textColor = "white";
              borderColor = "#4CAF50";
            } else if (status === "PENDING") {
              bgColor = "#FFC107";
              textColor = "#000";
              borderColor = "#FFC107";
            } else if (status === "FAILED") {
              bgColor = "#F44336";
              textColor = "white";
              borderColor = "#F44336";
            } else {
              bgColor = "#555";
              textColor = "white";
              borderColor = "#666";
            }
          }

          return (
            <button
              key={status}
              onClick={() => setSelectedFilter(status)}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedFilter !== status) {
                  e.target.style.backgroundColor = "#444";
                  e.target.style.borderColor = "#555";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFilter !== status) {
                  e.target.style.backgroundColor = "#333";
                  e.target.style.borderColor = "#444";
                }
              }}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Payments List */}
      {filteredOrders.length === 0 ? (
        <p style={{ color: "#888", textAlign: "center" }}>
          {orders.length === 0 ? "No payments found." : `No ${selectedFilter.toLowerCase()} payments found.`}
        </p>
      ) : (
        <div style={{ 
          maxWidth: "1000px", 
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                border: "1px solid #333",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2a2a2a";
                e.currentTarget.style.borderColor = "#444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1e1e1e";
                e.currentTarget.style.borderColor = "#333";
              }}
            >
              {/* Left: Status Icon */}
              <div style={{ flex: "0 0 auto" }}>
                {getStatusIcon(order.paymentStatus)}
              </div>

              {/* Center: Order Details */}
              <div style={{ flex: "1", color: "white", minWidth: "0" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#aaa" }}>
                  ORDER ID
                </p>
                <p style={{ 
                  margin: "0", 
                  fontSize: "13px", 
                  fontFamily: "monospace",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {order.razorpayOrderId}
                </p>
              </div>

              {/* Right: Amount and Status */}
              <div style={{ flex: "0 0 auto", textAlign: "right", color: "white" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#aaa" }}>
                  AMOUNT
                </p>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "bold" }}>
                  ₹{order.amount.toFixed(2)}
                </p>
                <span style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  backgroundColor: getStatusColor(order.paymentStatus) + "20",
                  color: getStatusColor(order.paymentStatus),
                  border: `1px solid ${getStatusColor(order.paymentStatus)}`,
                }}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPaymentsPage;
