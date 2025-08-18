package com.kesav.ecommerce.cart;

import com.kesav.ecommerce.product.Product;

public class CartResponseDTO {
    private Long id;
    private int quantity;
    private Product product;

    public CartResponseDTO(Cart cart) {
        this.id = cart.getId();
        this.quantity = cart.getQuantity();
        this.product = cart.getProduct();
    }

    public Long getId() {
        return id;
    }

    public int getQuantity() {
        return quantity;
    }

    public Product getProduct() {
        return product;
    }
}
