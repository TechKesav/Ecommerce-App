package com.kesav.ecommerce.order;

public class CreateOrderRequest {
    private Double amount; // in rupees
    private String currency = "INR";
    private String description = "No description";

    // getters & setters
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

