package com.kesav.ecommerce.analytics;

import com.kesav.ecommerce.analytics.SalesTrend;
import com.kesav.ecommerce.analytics.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController( AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/api/admin/sales-trend")
    public List<SalesTrend> getSalesTrend() {
        return analyticsService.getDailySales();
    }
}

