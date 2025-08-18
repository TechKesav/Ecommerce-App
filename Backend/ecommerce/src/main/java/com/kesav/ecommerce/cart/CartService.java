package com.kesav.ecommerce.cart;

import com.kesav.ecommerce.cart.Cart;

import java.util.List;

public interface CartService {
    Cart addToCart(Long userId, Long productId, int quantity);
    List<Cart> getCartByUser(Long userId);
    Cart updateCart(Long cartId, int quantity);
    void removeCartItem(Long cartId);
}
