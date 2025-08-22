package com.kesav.ecommerce.order;

import com.kesav.ecommerce.auth.JWTService;
import com.kesav.ecommerce.user.User;
import com.kesav.ecommerce.user.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;


    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest req,
                                         @RequestHeader("Authorization") String authHeader) {
        try {
            if (req.getAmount() == null) {
                return ResponseEntity.badRequest().body("{\"error\":\"amount is required\"}");
            }

            // Extract token
            String token = authHeader.replace("Bearer ", "");
            Long userId = JWTService.extractUserId(token);

            // Fetch User from DB
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Pass user to service
            JSONObject razorpayOrder = orderService.createRazorpayOrder(
                    req.getAmount(), req.getCurrency(), req.getDescription(), user
            );

            String id = razorpayOrder.getString("id");
            Integer amount = razorpayOrder.getInt("amount"); // paise
            String currency = razorpayOrder.getString("currency");

            CreateOrderResponse resp = new CreateOrderResponse(id, amount, currency, req.getDescription());
            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/update-payment")
    public ResponseEntity<?> updatePayment(@RequestBody UpdatePaymentRequest payload) {
        try {
            if (payload.getRazorpayOrderId() == null || payload.getPaymentId() == null) {
                return ResponseEntity.badRequest().body("{\"error\":\"razorpayOrderId and paymentId are required\"}");
            }

            Order updated = orderService.updatePayment(payload.getRazorpayOrderId(),
                    payload.getPaymentId(),
                    payload.getStatus() == null ? "PAID" : payload.getStatus());
            if (updated == null) {
                return ResponseEntity.status(404).body("{\"error\":\"Order not found\"}");
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }

    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("razorpayOrderId");
        String paymentId = payload.get("paymentId");
        String signature = payload.get("signature");

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest().body("{\"error\":\"Missing parameters\"}");
        }

        boolean isValid = orderService.verifySignature(orderId, paymentId, signature);
        if (!isValid) {
            return ResponseEntity.status(400).body("{\"error\":\"Invalid signature\"}");
        }

        Order updated = orderService.updatePayment(orderId, paymentId, "PAID");
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{razorpayOrderId}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String razorpayOrderId) {
        try {
            // Fetch order using Razorpay order ID
            Order order = orderService.getOrderByRazorpayOrderId(razorpayOrderId);
            if (order == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Order not found"));
            }
            return ResponseEntity.ok(Map.of(
                    "paymentStatus", order.getPaymentStatus(),
                    "razorpayOrderId", order.getRazorpayOrderId(),
                    "amount", order.getAmount(),
                    "currency", order.getCurrency(),
                    "description", order.getDescription()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }
}
