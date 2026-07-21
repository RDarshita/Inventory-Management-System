package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class OutstandingInvoiceResponse {
    private String invoiceNumber;
    private String partyName;
    private LocalDate invoiceDate;
    private BigDecimal outstandingAmount;
}
