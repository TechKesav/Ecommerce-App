package com.kesav.ecommerce.analytics;


import com.kesav.ecommerce.analytics.SalesTrend;
import com.kesav.ecommerce.order.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;

    public AnalyticsService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<SalesTrend> getDailySales() {
        return orderRepository.getDailySalesNative().stream()
                .map(r -> new SalesTrend(
                        ((java.sql.Date) r[0]).toLocalDate().atStartOfDay(),
                        new BigDecimal(r[1].toString())
                ))
                .collect(Collectors.toList());
    }

}

