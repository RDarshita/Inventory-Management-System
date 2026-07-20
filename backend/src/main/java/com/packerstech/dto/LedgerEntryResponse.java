package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LedgerEntryResponse {
    private Long id;
    private LocalDateTime date;
    private String type;       // e.g. "Sale", "Incoming", "Payment"
    private String reference;  // e.g. Invoice number
    private double debit;
    private double credit;
    private double balance;
}
