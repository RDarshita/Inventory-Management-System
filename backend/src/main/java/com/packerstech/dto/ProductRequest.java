package com.packerstech.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotBlank(message = "SKU is required")
    private String sku;

    private String description;

    private String category;

    private String supplier;

    @NotNull(message = "Purchase price is required")
    @Min(value = 0, message = "Purchase price cannot be negative")
    private Double purchasePrice;

    @NotNull(message = "Selling price is required")
    @Min(value = 0, message = "Selling price cannot be negative")
    private Double sellingPrice;

    @NotNull(message = "Opening quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer openingQuantity;

    private Integer minimumStockLevel;
}
