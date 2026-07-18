package com.packerstech.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String productName;
    private String sku;
    private String description;
    private String category;
    private String supplier;
    private Double purchasePrice;
    private Double sellingPrice;
    private Integer openingQuantity;
    private Integer minimumStockLevel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
