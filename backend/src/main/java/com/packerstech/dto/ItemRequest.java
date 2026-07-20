package com.packerstech.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemRequest {

    @NotBlank(message = "Description of goods is required")
    private String description;

    @NotBlank(message = "HSN/SAC Code is required")
    private String hsnSacCode;

    @NotNull(message = "Rate is required")
    @PositiveOrZero(message = "Rate must be zero or positive")
    private BigDecimal rate;

    @NotNull(message = "GST Percent is required")
    @PositiveOrZero(message = "GST Percent must be zero or positive")
    private BigDecimal gstPercent;

    private String poNumber;
}
