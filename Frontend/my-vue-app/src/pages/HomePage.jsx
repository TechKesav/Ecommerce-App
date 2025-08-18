import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Apply search filter
  useEffect(() => {
    let updatedProducts = [...products];

    if (searchQuery.trim()) {
      updatedProducts = updatedProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOrder === "low-high") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, products, sortOrder]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2 bg-gray-800 text-white border-gray-700 placeholder-gray-400"
        />

        {/* Sort Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded bg-gray-800 text-white border-gray-700"
        >
          <option value="">Sort by Price</option>
          <option value="low-high">Low to High</option>
          <option value="high-low">High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <ProductGrid products={filteredProducts} darkMode={true} />
    </div>
  );
};

export default HomePage;
