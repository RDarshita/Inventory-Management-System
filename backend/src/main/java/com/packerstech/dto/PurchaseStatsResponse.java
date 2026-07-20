package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PurchaseStatsResponse {
    private BigDecimal totalPurchase;
    private BigDecimal amountPaid;
    private BigDecimal outstanding;
    private String topItemSpend;
}
