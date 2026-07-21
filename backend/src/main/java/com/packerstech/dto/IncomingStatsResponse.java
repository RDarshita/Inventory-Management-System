package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class IncomingStatsResponse {
    private BigDecimal totalReceived;
    private BigDecimal receivedThisMonth;
    private BigDecimal pendingAmount;
    private BigDecimal dueAmount;
}
