import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const [productRes, imageRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/products/${id}/image`, { responseType: "blob" }),
        ]);

        setProduct(productRes.data);
        const imageBlobUrl = URL.createObjectURL(imageRes.data);
        setImageUrl(imageBlobUrl);
      } catch (err) {
        console.error("Error loading product details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading product...</div>;

  if (!product) return <div className="text-center p-4 text-red-600">Product not found.</div>;

  return (
  <div className="p-6 max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-lg text-white">
    <h2 className="text-3xl font-bold mb-4">{product.name}</h2>

    {imageUrl && (
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full max-w-md object-cover mb-6 rounded border border-gray-700"
      />
    )}

    <p className="text-xl text-green-400 font-semibold mb-2">₹{product.price}</p>
    <p className="mb-4 text-gray-300">{product.description || "No description available."}</p>
    <p className="mb-4 text-gray-300">
      Stock: {product.stock > 0 ? product.stock : "Out of stock"}
    </p>

    <button
      onClick={() => alert("Added to cart!")}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Add to Cart
    </button>
  </div>
);
};

export default ProductDetail;
