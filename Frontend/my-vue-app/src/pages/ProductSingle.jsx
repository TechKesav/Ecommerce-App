import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, apiUrl } from "../config";

const ProductSingle = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/products/${id}`));
        setProduct(res.data);
      } catch (err) {
        console.error("Product fetch failed", err);
      }
    };

    const fetchImage = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/${id}/image`, {
          responseType: "blob",
        });
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
      } catch (err) {
        console.error("Image load failed", err);
      }
    };

    fetchProduct();
    fetchImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id]);

  if (!product) return <div className="text-center p-4">Loading...</div>;

  return (
  <div className="max-w-2xl mx-auto mt-6 p-4 bg-gray-900 text-white border border-gray-700 shadow-lg rounded">
    {imageUrl && (
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-96 object-cover rounded mb-4 border border-gray-700"
      />
    )}
    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
    <p className="text-gray-300 mb-4">{product.description}</p>
    <p className="text-xl text-green-400 font-bold">₹{product.price}</p>
  </div>
);
};

export default ProductSingle;
