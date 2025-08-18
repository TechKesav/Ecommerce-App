package com.kesav.ecommerce.cart;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.kesav.ecommerce.product.Product;
import com.kesav.ecommerce.user.User;
import jakarta.persistence.*;

@Entity
public class Cart {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @ManyToOne
    @JsonBackReference(value = "user-cart")
    private User user;

    @ManyToOne
    @JsonBackReference(value = "product-cart")
    private Product product;


    public Cart() {}
    public Cart(User user, Product product, int quantity) {
        this.user = user;
        this.product = product;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}

