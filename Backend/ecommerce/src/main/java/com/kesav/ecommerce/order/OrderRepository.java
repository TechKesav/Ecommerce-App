package com.kesav.ecommerce.order;


import com.kesav.ecommerce.analytics.SalesTrend;
import com.kesav.ecommerce.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByRazorpayOrderId(String razorpayOrderId);
    List<Order> findByUserId(Long userId);

    @Query(value = """
      SELECT DATE(created_at) AS date,
           SUM(amount) AS totalSales
      FROM orders
      WHERE payment_status = 'SUCCESS'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
     """, nativeQuery = true)
    List<Object[]> getDailySalesNative();

}

