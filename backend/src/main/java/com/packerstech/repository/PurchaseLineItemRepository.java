package com.packerstech.repository;

import com.packerstech.entity.PurchaseLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseLineItemRepository extends JpaRepository<PurchaseLineItem, Long> {
    List<PurchaseLineItem> findByPurchaseId(Long purchaseId);
}
