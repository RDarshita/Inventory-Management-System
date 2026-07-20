package com.packerstech.service.impl;

import com.packerstech.dto.*;
import com.packerstech.entity.*;
import com.packerstech.exception.ResourceNotFoundException;
import com.packerstech.repository.*;
import com.packerstech.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseLineItemRepository lineItemRepository;
    private final PurchaseAllocationRepository allocationRepository;
    private final PartyRepository partyRepository;
    private final ItemRepository itemRepository;
    private final LedgerTransactionRepository ledgerTransactionRepository;

    @Override
    @Transactional
    public PurchaseResponse createPurchase(PurchaseRequest request) {
        Party party = partyRepository.findById(request.getPartyId())
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + request.getPartyId()));

        Purchase purchase = Purchase.builder()
                .party(party)
                .voucherNo(request.getVoucherNo())
                .gstin(request.getGstin() != null ? request.getGstin() : party.getGstin())
                .purchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now())
                .taxableValue(BigDecimal.ZERO)
                .gstAmount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.ZERO)
                .build();

        // Calculate line items and totals
        BigDecimal taxableTotal = BigDecimal.ZERO;
        BigDecimal gstTotal = BigDecimal.ZERO;

        if (request.getLineItems() != null) {
            for (PurchaseLineItemRequest liReq : request.getLineItems()) {
                BigDecimal lineTaxable = liReq.getQty().multiply(liReq.getRate()).setScale(2, RoundingMode.HALF_UP);
                BigDecimal lineGst = lineTaxable.multiply(liReq.getGstPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                BigDecimal lineTotal = lineTaxable.add(lineGst);

                Item item = null;
                if (liReq.getItemId() != null) {
                    item = itemRepository.findById(liReq.getItemId()).orElse(null);
                }

                PurchaseLineItem lineItem = PurchaseLineItem.builder()
                        .purchase(purchase)
                        .item(item)
                        .description(liReq.getDescription())
                        .hsnSac(liReq.getHsnSac())
                        .poNumber(liReq.getPoNumber())
                        .qty(liReq.getQty())
                        .rate(liReq.getRate())
                        .gstPercent(liReq.getGstPercent())
                        .lineTotal(lineTotal)
                        .build();

                purchase.getLineItems().add(lineItem);
                taxableTotal = taxableTotal.add(lineTaxable);
                gstTotal = gstTotal.add(lineGst);
            }
        }

        purchase.setTaxableValue(taxableTotal);
        purchase.setGstAmount(gstTotal);
        purchase.setTotalAmount(taxableTotal.add(gstTotal));

        Purchase saved = purchaseRepository.save(purchase);

        // Create a ledger transaction for this purchase
        LedgerTransaction ledger = LedgerTransaction.builder()
                .party(party)
                .transactionType("PURCHASE")
                .referenceNumber(saved.getVoucherNo())
                .amount(saved.getTotalAmount().doubleValue())
                .description("Purchase voucher: " + saved.getVoucherNo())
                .transactionDate(saved.getPurchaseDate())
                .build();
        ledgerTransactionRepository.save(ledger);

        return mapToResponse(saved);
    }

    @Override
    public PurchaseResponse getPurchaseById(Long id) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));
        return mapToResponse(purchase);
    }

    @Override
    public List<PurchaseResponse> getAllPurchases() {
        return purchaseRepository.findAllByOrderByPurchaseDateAsc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PurchaseResponse updatePurchase(Long id, PurchaseRequest request) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));

        Party party = partyRepository.findById(request.getPartyId())
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + request.getPartyId()));

        purchase.setParty(party);
        purchase.setVoucherNo(request.getVoucherNo());
        purchase.setGstin(request.getGstin() != null ? request.getGstin() : party.getGstin());
        purchase.setPurchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : purchase.getPurchaseDate());

        // Clear old line items
        purchase.getLineItems().clear();

        BigDecimal taxableTotal = BigDecimal.ZERO;
        BigDecimal gstTotal = BigDecimal.ZERO;

        if (request.getLineItems() != null) {
            for (PurchaseLineItemRequest liReq : request.getLineItems()) {
                BigDecimal lineTaxable = liReq.getQty().multiply(liReq.getRate()).setScale(2, RoundingMode.HALF_UP);
                BigDecimal lineGst = lineTaxable.multiply(liReq.getGstPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                BigDecimal lineTotal = lineTaxable.add(lineGst);

                Item item = null;
                if (liReq.getItemId() != null) {
                    item = itemRepository.findById(liReq.getItemId()).orElse(null);
                }

                PurchaseLineItem lineItem = PurchaseLineItem.builder()
                        .purchase(purchase)
                        .item(item)
                        .description(liReq.getDescription())
                        .hsnSac(liReq.getHsnSac())
                        .poNumber(liReq.getPoNumber())
                        .qty(liReq.getQty())
                        .rate(liReq.getRate())
                        .gstPercent(liReq.getGstPercent())
                        .lineTotal(lineTotal)
                        .build();

                purchase.getLineItems().add(lineItem);
                taxableTotal = taxableTotal.add(lineTaxable);
                gstTotal = gstTotal.add(lineGst);
            }
        }

        purchase.setTaxableValue(taxableTotal);
        purchase.setGstAmount(gstTotal);
        purchase.setTotalAmount(taxableTotal.add(gstTotal));

        Purchase updated = purchaseRepository.save(purchase);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deletePurchase(Long id) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + id));

        // Delete associated ledger transactions
        // Find by reference and type
        // (simple approach: delete all PURCHASE type ledger entries for this party with this voucher)
        // Note: this is best-effort cleanup
        purchaseRepository.delete(purchase);
    }

    @Override
    public PurchaseStatsResponse getPurchaseStats() {
        List<Purchase> all = purchaseRepository.findAll();

        BigDecimal totalPurchase = BigDecimal.ZERO;
        BigDecimal amountPaid = BigDecimal.ZERO;

        for (Purchase p : all) {
            totalPurchase = totalPurchase.add(p.getTotalAmount());
            BigDecimal paid = getPaidAmount(p);
            amountPaid = amountPaid.add(paid);
        }

        BigDecimal outstanding = totalPurchase.subtract(amountPaid);

        // Find top item spend
        String topItemSpend = getTopItemSpend();

        return PurchaseStatsResponse.builder()
                .totalPurchase(totalPurchase)
                .amountPaid(amountPaid)
                .outstanding(outstanding)
                .topItemSpend(topItemSpend)
                .build();
    }

    @Override
    public List<PurchaseItemReportResponse> getItemReport() {
        List<PurchaseLineItem> allLineItems = lineItemRepository.findAll();

        // Group by description (since items can be custom too)
        Map<String, List<PurchaseLineItem>> grouped = allLineItems.stream()
                .collect(Collectors.groupingBy(li -> li.getDescription() != null ? li.getDescription() : "Unknown"));

        List<PurchaseItemReportResponse> report = new ArrayList<>();

        for (Map.Entry<String, List<PurchaseLineItem>> entry : grouped.entrySet()) {
            List<PurchaseLineItem> items = entry.getValue();

            BigDecimal totalQty = items.stream()
                    .map(PurchaseLineItem::getQty)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalAmount = items.stream()
                    .map(PurchaseLineItem::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String hsnSac = items.stream()
                    .filter(i -> i.getHsnSac() != null)
                    .map(PurchaseLineItem::getHsnSac)
                    .findFirst()
                    .orElse("—");

            LocalDate lastDate = items.stream()
                    .map(li -> li.getPurchase().getPurchaseDate())
                    .max(Comparator.naturalOrder())
                    .orElse(null);

            report.add(PurchaseItemReportResponse.builder()
                    .description(entry.getKey())
                    .hsnSac(hsnSac)
                    .totalQty(totalQty)
                    .totalAmount(totalAmount)
                    .lastPurchaseDate(lastDate)
                    .build());
        }

        // Sort by totalAmount descending
        report.sort((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()));

        return report;
    }

    // --- Private helpers ---

    private BigDecimal getPaidAmount(Purchase purchase) {
        return purchase.getAllocations().stream()
                .map(PurchaseAllocation::getAllocatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String getStatus(Purchase purchase) {
        BigDecimal paid = getPaidAmount(purchase);
        if (paid.compareTo(BigDecimal.ZERO) == 0) {
            return "Unpaid";
        } else if (paid.compareTo(purchase.getTotalAmount()) >= 0) {
            return "Paid";
        } else {
            return "Partial";
        }
    }

    private String getTopItemSpend() {
        List<PurchaseLineItem> allLineItems = lineItemRepository.findAll();
        if (allLineItems.isEmpty()) return "—";

        Map<String, BigDecimal> spendByItem = new HashMap<>();
        Map<String, BigDecimal> qtyByItem = new HashMap<>();

        for (PurchaseLineItem li : allLineItems) {
            String desc = li.getDescription() != null ? li.getDescription() : "Unknown";
            spendByItem.merge(desc, li.getLineTotal(), BigDecimal::add);
            qtyByItem.merge(desc, li.getQty(), BigDecimal::add);
        }

        return spendByItem.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(e -> e.getKey() + " (" + qtyByItem.get(e.getKey()).stripTrailingZeros().toPlainString() + " qty)")
                .orElse("—");
    }

    private PurchaseResponse mapToResponse(Purchase purchase) {
        BigDecimal paid = getPaidAmount(purchase);
        String status = getStatus(purchase);

        List<PurchaseResponse.PurchaseLineItemResponse> lineItemResponses = purchase.getLineItems().stream()
                .map(li -> PurchaseResponse.PurchaseLineItemResponse.builder()
                        .id(li.getId())
                        .itemId(li.getItem() != null ? li.getItem().getId() : null)
                        .description(li.getDescription())
                        .hsnSac(li.getHsnSac())
                        .poNumber(li.getPoNumber())
                        .qty(li.getQty())
                        .rate(li.getRate())
                        .gstPercent(li.getGstPercent())
                        .lineTotal(li.getLineTotal())
                        .build())
                .collect(Collectors.toList());

        return PurchaseResponse.builder()
                .id(purchase.getId())
                .partyId(purchase.getParty().getId())
                .partyName(purchase.getParty().getCompanyName())
                .voucherNo(purchase.getVoucherNo())
                .gstin(purchase.getGstin())
                .purchaseDate(purchase.getPurchaseDate())
                .taxableValue(purchase.getTaxableValue())
                .gstAmount(purchase.getGstAmount())
                .totalAmount(purchase.getTotalAmount())
                .paidAmount(paid)
                .balanceAmount(purchase.getTotalAmount().subtract(paid))
                .status(status)
                .createdAt(purchase.getCreatedAt())
                .lineItems(lineItemResponses)
                .build();
    }
}
