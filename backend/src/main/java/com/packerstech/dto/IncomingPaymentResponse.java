package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class IncomingPaymentResponse {
    private Long id;
    private Long partyId;
    private String partyName;
    private String gstin;
    private String transactionId;
    private LocalDate paymentDate;
    private BigDecimal amountReceived;
    private String notes;
    private LocalDateTime createdAt;
}
