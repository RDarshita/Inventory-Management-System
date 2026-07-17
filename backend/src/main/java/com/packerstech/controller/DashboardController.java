package com.packerstech.controller;

import com.packerstech.dto.DashboardSummaryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        // Dummy Activity Data
        List<DashboardSummaryDTO.Activity> activities = Arrays.asList(
                DashboardSummaryDTO.Activity.builder()
                        .id("1")
                        .type("Product Added")
                        .title("Added new product: Premium Packing Tape")
                        .timestamp("10 mins ago")
                        .status("Success")
                        .build(),
                DashboardSummaryDTO.Activity.builder()
                        .id("2")
                        .type("Stock Updated")
                        .title("Stock updated for Corrugated Boxes")
                        .timestamp("1 hour ago")
                        .status("Info")
                        .build(),
                DashboardSummaryDTO.Activity.builder()
                        .id("3")
                        .type("Low Stock Alert")
                        .title("Bubble Wrap is running low (<50 rolls)")
                        .timestamp("3 hours ago")
                        .status("Warning")
                        .build(),
                DashboardSummaryDTO.Activity.builder()
                        .id("4")
                        .type("Purchase Completed")
                        .title("PO-2023-045 received from Supplier Inc.")
                        .timestamp("5 hours ago")
                        .status("Success")
                        .build(),
                DashboardSummaryDTO.Activity.builder()
                        .id("5")
                        .type("Sale Completed")
                        .title("Invoice INV-1002 paid by ABC Corp.")
                        .timestamp("1 day ago")
                        .status("Success")
                        .build()
        );

        // Dummy Chart Data
        List<DashboardSummaryDTO.ChartData> monthlySales = Arrays.asList(
                new DashboardSummaryDTO.ChartData("Jan", 45000.0, null),
                new DashboardSummaryDTO.ChartData("Feb", 52000.0, null),
                new DashboardSummaryDTO.ChartData("Mar", 48000.0, null),
                new DashboardSummaryDTO.ChartData("Apr", 61000.0, null),
                new DashboardSummaryDTO.ChartData("May", 59000.0, null),
                new DashboardSummaryDTO.ChartData("Jun", 75000.0, null)
        );

        List<DashboardSummaryDTO.ChartData> inventoryByCategory = Arrays.asList(
                new DashboardSummaryDTO.ChartData("Boxes", 400.0, null),
                new DashboardSummaryDTO.ChartData("Tapes", 300.0, null),
                new DashboardSummaryDTO.ChartData("Bubble Wrap", 300.0, null),
                new DashboardSummaryDTO.ChartData("Labels", 200.0, null)
        );

        List<DashboardSummaryDTO.ChartData> topSelling = Arrays.asList(
                new DashboardSummaryDTO.ChartData("Corrugated Box XL", 1200.0, null),
                new DashboardSummaryDTO.ChartData("Fragile Tape", 800.0, null),
                new DashboardSummaryDTO.ChartData("Bubble Wrap 50m", 600.0, null)
        );

        List<DashboardSummaryDTO.ChartData> purchaseVsSales = Arrays.asList(
                new DashboardSummaryDTO.ChartData("Jan", 45000.0, 30000.0), // value = Sales, value2 = Purchases
                new DashboardSummaryDTO.ChartData("Feb", 52000.0, 35000.0),
                new DashboardSummaryDTO.ChartData("Mar", 48000.0, 28000.0),
                new DashboardSummaryDTO.ChartData("Apr", 61000.0, 42000.0)
        );

        DashboardSummaryDTO summary = DashboardSummaryDTO.builder()
                .totalProducts(245)
                .productsChange(5.2)
                .todaysSales(12500.0)
                .todaysSalesChange(15.4)
                .inventoryValue(850000.0)
                .inventoryValueChange(-2.1)
                .lowStockProducts(12)
                .lowStockChange(8.0) // means 8% increase in low stock (bad)
                .totalCustomers(156)
                .customersChange(12.0)
                .totalSuppliers(45)
                .suppliersChange(0.0)
                .pendingOrders(28)
                .pendingOrdersChange(-5.0)
                .monthlyRevenue(450000.0)
                .monthlyRevenueChange(18.5)
                .monthlySalesData(monthlySales)
                .inventoryByCategoryData(inventoryByCategory)
                .topSellingProductsData(topSelling)
                .purchaseVsSalesData(purchaseVsSales)
                .recentActivity(activities)
                .build();

        return ResponseEntity.ok(summary);
    }
}
