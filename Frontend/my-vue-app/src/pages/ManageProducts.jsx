import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import '../styles/ManageProducts.css';
import { API_BASE_URL, apiUrl } from '../config';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageFile: null
  });

  const token = sessionStorage.getItem('token');

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl('/api/products'));
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      imageFile: e.target.files[0]
    }));
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append('product', new Blob([JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      })], { type: 'application/json' }));
      
      if (formData.imageFile) {
        form.append('imageFile', formData.imageFile);
      }

      await axios.post(apiUrl('/api/products'), form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Product added successfully!');
      setFormData({ name: '', description: '', price: '', stock: '', imageFile: null });
      setIsAdding(false);
      fetchProducts();
    } catch (err) {
      alert('❌ Error adding product: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append('product', new Blob([JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      })], { type: 'application/json' }));
      
      if (formData.imageFile) {
        form.append('imageFile', formData.imageFile);
      }

      await axios.put(apiUrl(`/api/products/${editingId}`), form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Product updated successfully!');
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', stock: '', imageFile: null });
      fetchProducts();
    } catch (err) {
      alert('❌ Error updating product: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(apiUrl(`/api/products/${id}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        alert('✅ Product deleted successfully!');
        fetchProducts();
      } catch (err) {
        alert('❌ Error deleting product: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Start editing a product
  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageFile: null
    });
    setIsAdding(false);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', description: '', price: '', stock: '', imageFile: null });
  };

  return (
    <div className="manage-products-container">
      <div className="manage-header">
        <h1>📦 Manage Products</h1>
        <button 
          className="btn-add-product"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', stock: '', imageFile: null });
          }}
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="form-section">
          <h2>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          <form onSubmit={editingId ? handleEditProduct : handleAddProduct}>
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <input
                type="file"
                name="imageFile"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? '⏳ Processing...' : (editingId ? '✅ Update Product' : '✅ Add Product')}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={cancelEdit}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="products-list">
        <h2>All Products ({products.length})</h2>
        {loading && !products.length ? (
          <p className="loading">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="no-products">No products found. Add one to get started!</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.imageData ? (
                    <img src={`${API_BASE_URL}/api/products/${product.id}/image`} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description.substring(0, 100)}...</p>
                  <div className="product-meta">
                    <span className="price">₹{product.price}</span>
                    <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    className="btn-edit"
                    onClick={() => startEdit(product)}
                    disabled={loading}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={loading}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
