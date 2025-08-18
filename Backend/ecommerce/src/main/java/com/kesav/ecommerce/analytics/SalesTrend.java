package com.kesav.ecommerce.analytics;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class SalesTrend {

    private LocalDateTime dateTime;
    private BigDecimal totalSales;

    public SalesTrend(LocalDateTime dateTime, BigDecimal totalSales) {
        this.dateTime = dateTime;
        this.totalSales = totalSales;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }
}
