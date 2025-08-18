package com.kesav.ecommerce.order;

import com.kesav.ecommerce.user.User;
import com.razorpay.RazorpayException;
import org.json.JSONObject;

import java.util.List;

public interface OrderService {

    JSONObject createRazorpayOrder(Double amount, String currency, String description, User user) throws RazorpayException;

    Order saveOrder(Order order);

    Order updatePayment(String razorpayOrderId, String paymentId, String status);

    boolean verifySignature(String orderId, String paymentId, String signature);

    Order getOrderByRazorpayOrderId(String razorpayOrderId);

    List<Order> getOrdersByUser(Long userId);
}
