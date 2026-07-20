package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ItemResponse {
    private Long id;
    private Long partyId;
    private String description;
    private String hsnSacCode;
    private BigDecimal rate;
    private BigDecimal gstPercent;
    private String poNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
