package com.kesav.ecommerce.order;

import lombok.Data;

@Data
public class PaymentResponse {
    private String orderId;
    private String paymentId;
    private String signature;
}

