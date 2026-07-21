package com.packerstech.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomingPaymentRequest {

    @NotNull(message = "Party ID is required")
    private Long partyId;

    @NotBlank(message = "Transaction ID is required")
    private String transactionId;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @NotNull(message = "Amount received is required")
    @Min(value = 0, message = "Amount must be greater than 0")
    private BigDecimal amountReceived;

    private String notes;
}
