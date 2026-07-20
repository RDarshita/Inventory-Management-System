package com.packerstech.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PurchaseLineItemRequest {
    private Long itemId;
    private String description;
    private String hsnSac;
    private String poNumber;
    private BigDecimal qty;
    private BigDecimal rate;
    private BigDecimal gstPercent;
}
