import React from "react";
import { useNavigate } from "react-router-dom";

const CartIcon = ({ cartCount }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => navigate("/cart")}
    >
      <span className="text-2xl">🛒</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
