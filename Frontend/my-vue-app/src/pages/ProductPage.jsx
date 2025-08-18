import { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth"; // adjust path as needed

const ProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const { isAdmin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:8080/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Product added successfully!");
      console.log("Product Saved:", response.data);
      setProduct({ name: "", description: "", price: "", stock: "" });
      setImageFile(null);
    } catch (error) {
      setMessage("❌ Error adding product");
      console.error(error);
    }
  };

  return (
  <div className="max-w-lg mx-auto p-6 mt-8 bg-gray-900 rounded shadow-lg text-gray-200">
    <h2 className="text-2xl font-bold mb-4 text-white">Add Product</h2>

    {!isAdmin ? (
      <p className="text-red-500 text-center font-semibold">⚠️ Only admins can add products.</p>
    ) : (
      <>
        {message && <p className="mb-3 text-green-400">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="p-2 border border-gray-700 bg-gray-800 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Product Description"
            required
            className="p-2 border border-gray-700 bg-gray-800 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="p-2 border border-gray-700 bg-gray-800 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            required
            className="p-2 border border-gray-700 bg-gray-800 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border border-gray-700 bg-gray-800 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </form>
      </>
    )}
  </div>
);
};

export default ProductPage;
