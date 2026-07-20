package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PartyResponse {
    private Long id;
    private String companyName;
    private String gstin;
    private String companyAddress;
    private String pincode;
    private String stateCode;
    private String phoneNo;
    private String email;
    private Integer paymentPeriodDays;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
