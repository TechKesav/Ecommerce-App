package com.kesav.ecommerce.cart;

import com.kesav.ecommerce.product.Product;
import com.kesav.ecommerce.product.ProductService;
import com.kesav.ecommerce.user.User;
import com.kesav.ecommerce.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        Long userId = request.getUserId();
        Long productId = request.getProductId();
        int quantity = request.getQuantity();

        Cart cartItem = cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartResponseDTO>> getUserCart(@PathVariable Long userId) {
        List<Cart> cartList = cartService.getCartByUser(userId);
        List<CartResponseDTO> response = cartList.stream()
                .map(CartResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable Long cartId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(cartService.updateCart(cartId, quantity));
    }

    @DeleteMapping("/delete/{cartId}")
    public ResponseEntity<String> removeCartItem(@PathVariable Long cartId) {
        cartService.removeCartItem(cartId);
        return ResponseEntity.ok("Item removed from cart");
    }
}
