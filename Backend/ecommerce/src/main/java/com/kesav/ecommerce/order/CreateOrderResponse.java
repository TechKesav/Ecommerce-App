package com.kesav.ecommerce.order;

public class CreateOrderResponse {
    private String id;          // razorpay order id
    private Integer amount;     // paise
    private String currency;
    private String description;

    public CreateOrderResponse(String id, Integer amount, String currency, String description) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
    }

    // getters
    public String getId() { return id; }
    public Integer getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getDescription() { return description; }
}

