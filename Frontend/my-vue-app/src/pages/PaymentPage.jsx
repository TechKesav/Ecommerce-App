import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { apiUrl } from "../config";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("token");

    axios
      .get(apiUrl(`/api/orders/${orderId}/status`), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);

        if (res.data.paymentStatus === "FAILED") {
          navigate("/payment-failed");
        }
      })
      .catch(() => {
        setOrder(null);
        setLoading(false);
      });
  }, [orderId, navigate]);

  if (loading) return <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  if (!order) return <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Order not found</p>;

  // Get status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <FaCheckCircle style={{ color: "#4CAF50", fontSize: "32px" }} />;
      case "PENDING":
        return <FaClock style={{ color: "#FFC107", fontSize: "32px" }} />;
      case "FAILED":
        return <FaTimesCircle style={{ color: "#F44336", fontSize: "32px" }} />;
      default:
        return null;
    }
  };

  const statusColor =
    order.paymentStatus === "SUCCESS" ? "#4CAF50" :
    order.paymentStatus === "PENDING" ? "#FFC107" :
    "#F44336";

  return (
    <div style={{
      backgroundColor: "#000",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}>
      <div style={{
        backgroundColor: "#1e1e1e",
        borderRadius: "8px",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        padding: "30px 40px",
        maxWidth: "500px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "30px",
      }}>
        {/* Left: Icon */}
        <div style={{ flex: "0 0 auto" }}>
          {getStatusIcon(order.paymentStatus)}
        </div>

        {/* Center: Order Info */}
        <div style={{ flex: "1", textAlign: "left", color: "white" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#aaa" }}>
            ORDER ID
          </p>
          <p style={{ margin: "0 0 16px 0", fontSize: "14px", fontFamily: "monospace" }}>
            {orderId}
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#aaa" }}>
            STATUS
          </p>
          <p style={{ 
            margin: "0", 
            fontSize: "18px", 
            fontWeight: "bold",
            color: statusColor 
          }}>
            {order.paymentStatus}
          </p>
        </div>

        {/* Right: Action Button */}
        <div style={{ flex: "0 0 auto" }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              backgroundColor: statusColor,
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => {
              e.target.style.opacity = "0.8";
            }}
            onMouseOut={(e) => {
              e.target.style.opacity = "1";
            }}
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
