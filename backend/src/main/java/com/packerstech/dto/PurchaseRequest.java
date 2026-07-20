package com.packerstech.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PurchaseRequest {
    private Long partyId;
    private String voucherNo;
    private String gstin;
    private LocalDate purchaseDate;
    private List<PurchaseLineItemRequest> lineItems;
}
