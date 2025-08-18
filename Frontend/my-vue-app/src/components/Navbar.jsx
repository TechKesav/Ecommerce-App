import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 p-4 text-white">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to={isLoggedIn ? "/home" : "/login"}>E-Shop</Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/products">📦 AddProducts</Link>
            <Link to="/cart">🛒 Cart</Link>
            <Link to="/userpayments">💳 PaymentStatus</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
