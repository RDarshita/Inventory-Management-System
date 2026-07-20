package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private Long partyId;
    private String transactionType;
    private String referenceNumber;
    private Double amount;
    private String description;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;
}
