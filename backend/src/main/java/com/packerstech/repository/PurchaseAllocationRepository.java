package com.packerstech.repository;

import com.packerstech.entity.PurchaseAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseAllocationRepository extends JpaRepository<PurchaseAllocation, Long> {
    List<PurchaseAllocation> findByPurchaseId(Long purchaseId);
    List<PurchaseAllocation> findByOutgoingPaymentId(Long outgoingPaymentId);
}
