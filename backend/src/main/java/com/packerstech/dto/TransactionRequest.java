package com.packerstech.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionRequest {

    @NotBlank(message = "Transaction type is required")
    private String transactionType;

    private String referenceNumber;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Double amount;

    private String description;

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;
}
