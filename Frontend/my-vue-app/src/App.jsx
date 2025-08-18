import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // ✅ Import here
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage";
import UserPage from "./pages/UserPage";
import CartPage from "./pages/CartPage";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/productDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductSingle from "./pages/ProductSingle";
import AdminRoute from "./routes/AdminRoute";
import PaymentPage from "./pages/PaymentPage";
import UserPaymentsPage from "./pages/UserPaymentspage";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/users" element={<UserPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/products/:id" element={<ProductSingle />} />
                <Route path="/products" element={ <AdminRoute> <ProductPage /> </AdminRoute>}/>
                <Route path="/payment/:orderId" element={<PaymentPage />} />
                <Route path="/userpayments" element={<UserPaymentsPage />} />
                <Route path="/admin-dashboard" element={ <AdminRoute><AdminDashboard/></AdminRoute>}/>
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
            </div>
            <Footer />
            <ToastContainer position="top-right" autoClose={2000} />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
