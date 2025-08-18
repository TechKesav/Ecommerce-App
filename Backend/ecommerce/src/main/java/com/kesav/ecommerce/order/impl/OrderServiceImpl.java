package com.kesav.ecommerce.order.impl;

import com.kesav.ecommerce.order.Order;
import com.kesav.ecommerce.order.OrderRepository;
import com.kesav.ecommerce.order.OrderService;
import com.kesav.ecommerce.order.PaymentStatus;
import com.kesav.ecommerce.user.User;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Value("${razorpay.keyId}")
    private String keyId;

    @Value("${razorpay.keySecret}")
    private String keySecret;

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public JSONObject createRazorpayOrder(Double amount, String currency, String description, User user) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int) (amount * 100)); // paise
        options.put("currency", currency);
        options.put("receipt", "order_rcpt_" + System.currentTimeMillis());
        options.put("payment_capture", 1);

        com.razorpay.Order razorpayOrder = client.orders.create(options);

        Order order = new Order();
        order.setUser(user); // ✅ assign the logged-in user
        order.setAmount(amount);
        order.setCurrency(currency);
        order.setDescription(description);
        order.setRazorpayOrderId(razorpayOrder.get("id"));
        order.setPaymentStatus(PaymentStatus.PENDING);

        orderRepository.save(order);

        return razorpayOrder.toJson();
    }

    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order updatePayment(String razorpayOrderId, String paymentId, String status) {
        Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId);
        if (order != null) {
            order.setPaymentId(paymentId);

            if ("PAID".equalsIgnoreCase(status)) {
                order.setPaymentStatus(PaymentStatus.SUCCESS);
            } else if ("FAILED".equalsIgnoreCase(status)) {
                order.setPaymentStatus(PaymentStatus.FAILED);
            } else {
                order.setPaymentStatus(PaymentStatus.PENDING);
            }

            return orderRepository.save(order);
        }
        return null;
    }


    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            String generatedSignature = hmacSHA256(payload, keySecret);
            return generatedSignature.equals(signature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Order getOrderByRazorpayOrderId(String razorpayOrderId) {
        return orderRepository.findByRazorpayOrderId(razorpayOrderId);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes());
        return new String(Hex.encode(hash));
    }
}
