import { useEffect, useState } from "react";
import axios from "axios";

const MAX_TEST_AMOUNT = 500000; 

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [images, setImages] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
        setCartItems(res.data);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    if (userId) fetchCart();
  }, [userId]);

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};

      await Promise.all(
        cartItems.map(async (item) => {
          try {
            const res = await axios.get(
              `http://localhost:8080/api/products/${item.product.id}/image`,
              { responseType: "blob" }
            );
            const objectUrl = URL.createObjectURL(res.data);
            newImages[item.product.id] = objectUrl;
          } catch (err) {
            console.error("Image load failed for product", item.product.id);
          }
        })
      );

      setImages(newImages);
    };

    if (cartItems.length > 0) {
      fetchImages();
    }
  }, [cartItems]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleDelete = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/delete/${cartId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      alert("Item removed from cart");
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to remove item from cart");
    }
  };

  const handleBuyNowAll = async () => {
    try {
      let amountToCharge = totalAmount;
      if (amountToCharge > MAX_TEST_AMOUNT) {
        alert(
          `Test mode limit is ₹${MAX_TEST_AMOUNT.toLocaleString()}. Using ₹${MAX_TEST_AMOUNT} instead for demo.`
        );
        amountToCharge = MAX_TEST_AMOUNT;
      }

      const createRes = await axios.post("http://localhost:8080/api/orders/create", {
        amount: amountToCharge * 100, // paise
        currency: "INR",
        description: `Purchase of all cart items`,
      });

      const orderData = createRes.data;

      const options = {
        key: "rzp_test_cDwJbY6QRF2zVw",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "My E-commerce Store",
        description: "Cart purchase",
        order_id: orderData.id,
        handler: async function (res) {
          try {
            await axios.post("http://localhost:8080/api/orders/update-payment", {
              razorpayOrderId: res.razorpay_order_id,
              paymentId: res.razorpay_payment_id,
              status: "PAID",
            });
            alert("Payment successful! Payment ID: " + res.razorpay_payment_id);
          } catch (err) {
            alert("Payment succeeded but could not update server.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + (response.error?.description || "Unknown reason"));
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating order: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-white">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border border-gray-700 p-3 rounded shadow gap-4 bg-gray-800"
              >
                <img
                  src={images[item.product.id]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="text-lg font-semibold text-white">{item.product.name}</p>
                  <p className="text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-green-400">Price: ₹{item.product.price}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-white">
                    Total: ₹{item.product.price * item.quantity}
                  </p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total & Buy Now */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold text-white">Grand Total: ₹{totalAmount}</p>
            <button
              onClick={handleBuyNowAll}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
