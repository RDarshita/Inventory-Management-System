package com.packerstech.service;

import com.packerstech.dto.PurchaseItemReportResponse;
import com.packerstech.dto.PurchaseRequest;
import com.packerstech.dto.PurchaseResponse;
import com.packerstech.dto.PurchaseStatsResponse;

import java.util.List;

public interface PurchaseService {
    PurchaseResponse createPurchase(PurchaseRequest request);
    PurchaseResponse getPurchaseById(Long id);
    List<PurchaseResponse> getAllPurchases();
    PurchaseResponse updatePurchase(Long id, PurchaseRequest request);
    void deletePurchase(Long id);
    PurchaseStatsResponse getPurchaseStats();
    List<PurchaseItemReportResponse> getItemReport();
}
