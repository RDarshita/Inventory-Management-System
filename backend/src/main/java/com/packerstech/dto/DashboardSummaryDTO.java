package com.packerstech.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    // Top Row KPIs
    private int totalProducts;
    private double todaysSales;
    private double inventoryValue;
    private int lowStockProducts;

    private double productsChange;
    private double todaysSalesChange;
    private double inventoryValueChange;
    private double lowStockChange;

    // Second Row KPIs
    private int totalCustomers;
    private int totalSuppliers;
    private int pendingOrders;
    private double monthlyRevenue;

    private double customersChange;
    private double suppliersChange;
    private double pendingOrdersChange;
    private double monthlyRevenueChange;
    
    // Charts Data
    private List<ChartData> monthlySalesData;
    private List<ChartData> inventoryByCategoryData;
    private List<ChartData> topSellingProductsData;
    private List<ChartData> purchaseVsSalesData;

    // Recent Activity
    private List<Activity> recentActivity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Activity {
        private String id;
        private String type; // e.g., "Product Added", "Supplier Added", "Stock Updated"
        private String title;
        private String timestamp;
        private String status; // "Success", "Warning", "Info"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartData {
        private String name;
        private Double value;
        private Double value2; // For comparison charts like Purchase vs Sales
    }
}
