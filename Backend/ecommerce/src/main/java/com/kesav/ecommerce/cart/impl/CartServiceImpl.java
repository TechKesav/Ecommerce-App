package com.kesav.ecommerce.cart.impl;

import com.kesav.ecommerce.cart.Cart;
import com.kesav.ecommerce.cart.CartRepository;
import com.kesav.ecommerce.cart.CartService;
import com.kesav.ecommerce.product.Product;
import com.kesav.ecommerce.product.ProductRepository;
import com.kesav.ecommerce.user.User;
import com.kesav.ecommerce.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = new Cart(user, product, quantity);
        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    public Cart updateCart(Long cartId, int quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Override
    public void removeCartItem(Long cartId) {
        cartRepository.deleteById(cartId);
    }
}
