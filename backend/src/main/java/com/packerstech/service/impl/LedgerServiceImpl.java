package com.packerstech.service.impl;

import com.packerstech.dto.*;
import com.packerstech.entity.LedgerTransaction;
import com.packerstech.entity.Party;
import com.packerstech.exception.ResourceNotFoundException;
import com.packerstech.repository.LedgerTransactionRepository;
import com.packerstech.repository.PartyRepository;
import com.packerstech.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerServiceImpl implements LedgerService {

    private final LedgerTransactionRepository transactionRepository;
    private final PartyRepository partyRepository;

    @Override
    public TransactionResponse createTransaction(Long partyId, TransactionRequest request) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + partyId));

        LedgerTransaction transaction = LedgerTransaction.builder()
                .party(party)
                .transactionType(request.getTransactionType().toUpperCase())
                .referenceNumber(request.getReferenceNumber())
                .amount(request.getAmount())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .build();

        LedgerTransaction saved = transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .id(saved.getId())
                .partyId(partyId)
                .transactionType(saved.getTransactionType())
                .referenceNumber(saved.getReferenceNumber())
                .amount(saved.getAmount())
                .description(saved.getDescription())
                .transactionDate(saved.getTransactionDate())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public List<LedgerEntryResponse> getPartyLedger(Long partyId) {
        partyRepository.findById(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + partyId));

        List<LedgerTransaction> transactions = transactionRepository
                .findByPartyIdOrderByTransactionDateDescCreatedAtDesc(partyId);

        // Calculate running balance from oldest to newest, then reverse for display
        List<LedgerTransaction> chronological = new ArrayList<>(transactions);
        Collections.reverse(chronological);

        List<LedgerEntryResponse> entries = new ArrayList<>();
        double runningBalance = 0;

        for (LedgerTransaction t : chronological) {
            double debit = 0;
            double credit = 0;
            String type = t.getTransactionType();

            switch (type) {
                case "SALE":
                    debit = t.getAmount();
                    break;
                case "PURCHASE":
                    credit = t.getAmount();
                    break;
                case "PAYMENT_RECEIVED":
                    credit = t.getAmount();
                    break;
                case "PAYMENT_SENT":
                    debit = t.getAmount();
                    break;
                case "EXPENSE":
                    debit = t.getAmount();
                    break;
                case "REFUND":
                    credit = t.getAmount();
                    break;
                default:
                    debit = t.getAmount();
            }

            runningBalance = runningBalance + debit - credit;

            // Format display type: PAYMENT_RECEIVED -> Payment received
            String displayType = type.replace("_", " ");
            displayType = displayType.substring(0, 1).toUpperCase() + displayType.substring(1).toLowerCase();

            entries.add(LedgerEntryResponse.builder()
                    .id(t.getId())
                    .date(t.getTransactionDate().atStartOfDay())
                    .type(displayType)
                    .reference(t.getReferenceNumber() != null ? t.getReferenceNumber() : "-")
                    .debit(debit)
                    .credit(credit)
                    .balance(runningBalance)
                    .build());
        }

        // Reverse so newest is on top
        Collections.reverse(entries);
        return entries;
    }

    @Override
    public PartySummaryResponse getPartySummary(Long partyId) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + partyId));

        double totalSales = transactionRepository.sumAmountByPartyIdAndType(partyId, "SALE");
        double totalPaymentReceived = transactionRepository.sumAmountByPartyIdAndType(partyId, "PAYMENT_RECEIVED");

        double totalReceived = totalPaymentReceived;
        double pendingAmount = totalSales - totalPaymentReceived;
        double dueAmount = Math.max(0, pendingAmount);

        PartyResponse partyResponse = PartyResponse.builder()
                .id(party.getId())
                .companyName(party.getCompanyName())
                .gstin(party.getGstin())
                .companyAddress(party.getCompanyAddress())
                .pincode(party.getPincode())
                .stateCode(party.getStateCode())
                .phoneNo(party.getPhoneNo())
                .email(party.getEmail())
                .paymentPeriodDays(party.getPaymentPeriodDays())
                .notes(party.getNotes())
                .createdAt(party.getCreatedAt())
                .updatedAt(party.getUpdatedAt())
                .build();

        return PartySummaryResponse.builder()
                .party(partyResponse)
                .totalSales(totalSales)
                .totalReceived(totalReceived)
                .pendingAmount(pendingAmount)
                .dueAmount(dueAmount)
                .build();
    }
}
