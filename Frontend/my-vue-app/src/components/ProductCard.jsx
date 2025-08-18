import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded");
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!product?.id) return;

    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${product.id}/image`,
          { responseType: "blob" }
        );
        const objectUrl = URL.createObjectURL(response.data);
        setImageUrl(objectUrl);
      } catch (err) {
        console.error("Failed to load image:", err);
      }
    };

    fetchImage();
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await axios.post("http://localhost:8080/api/cart/add", {
        userId: userId,
        productId: product.id,
        quantity: 1,
      });
      addToCart(product);
      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart failed", err);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet.");
        return;
      }

      const createRes = await axios.post("http://localhost:8080/api/orders/create", {
        amount: product.price,
        currency: "INR",
        description: `Purchase of ${product.name}`,
      });

      const orderData = createRes.data;

      const options = {
        key: "rzp_test_cDwJbY6QRF2zVw",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "My E-commerce Store",
        description: orderData.description,
        order_id: orderData.id,
        prefill: {
          email: "success@razorpay",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
         handler: async function (res) {
    try {
      // 1️⃣ Update payment status on server
      await axios.post("http://localhost:8080/api/orders/update-payment", {
        razorpayOrderId: res.razorpay_order_id,
        paymentId: res.razorpay_payment_id,
        status: "PAID",
      });

      console.log("Payment successful:", res);

      // 2️⃣ Navigate to payment status page
      navigate(`/payment/${res.razorpay_order_id}`);
    } catch (err) {
      console.error("Payment succeeded but server update failed:", err);
      alert(
        "Payment succeeded but could not update server: " + err.message
      );

      navigate(`/payment/${res.razorpay_order_id}`);
    }
  },
  };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response);
        alert(
          "Payment failed: " +
            (response.error?.description || "Unknown reason")
        );
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating order: " + err.message);
    }
  };

  return (
    <div className="border rounded shadow p-4">
      <Link to={`/products/${product.id}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover mb-2 rounded"
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex justify-center items-center">
            <span>No Image</span>
          </div>
        )}
      </Link>

      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p>{product.description}</p>
      <p className="text-green-600 font-bold">₹{product.price}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleAddToCart}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
