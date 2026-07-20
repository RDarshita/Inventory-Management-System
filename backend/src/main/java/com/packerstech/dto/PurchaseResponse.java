package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PurchaseResponse {
    private Long id;
    private Long partyId;
    private String partyName;
    private String voucherNo;
    private String gstin;
    private LocalDate purchaseDate;
    private BigDecimal taxableValue;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<PurchaseLineItemResponse> lineItems;

    @Data
    @Builder
    public static class PurchaseLineItemResponse {
        private Long id;
        private Long itemId;
        private String description;
        private String hsnSac;
        private String poNumber;
        private BigDecimal qty;
        private BigDecimal rate;
        private BigDecimal gstPercent;
        private BigDecimal lineTotal;
    }
}
