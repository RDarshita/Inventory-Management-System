package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PartySummaryResponse {
    private PartyResponse party;
    private double totalSales;
    private double totalReceived;
    private double pendingAmount;
    private double dueAmount;
}
