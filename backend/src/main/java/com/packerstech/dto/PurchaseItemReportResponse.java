package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PurchaseItemReportResponse {
    private String description;
    private String hsnSac;
    private BigDecimal totalQty;
    private BigDecimal totalAmount;
    private LocalDate lastPurchaseDate;
}
