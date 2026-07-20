package com.packerstech.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PartyRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "GSTIN is required")
    @Size(max = 15, message = "GSTIN must be at most 15 characters")
    private String gstin;

    private String companyAddress;

    private String pincode;

    private String stateCode;

    private String phoneNo;

    private String email;

    @Min(value = 1, message = "Payment period must be a positive number")
    private Integer paymentPeriodDays;

    private String notes;
}
