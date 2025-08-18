import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8080/api/orders/${orderId}/status`, {
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

  // Determine status color
  const statusColor =
    order.paymentStatus === "SUCCESS" ? "#4CAF50" :
    order.paymentStatus === "PENDING" ? "#FFC107" :
    "#F44336"; // FAILED

  return (
    <div style={{
      backgroundColor: "#000",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{
        backgroundColor: "#1e1e1e",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        textAlign: "center",
        width: "350px",
      }}>
        <h1 style={{ marginBottom: "20px" }}>Payment Status</h1>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: statusColor, fontWeight: "bold" }}>
            {order.paymentStatus}
          </span>
        </p>
      </div>
    </div>
  );
}
