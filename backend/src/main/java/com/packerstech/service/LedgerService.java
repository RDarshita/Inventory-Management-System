package com.packerstech.service;

import com.packerstech.dto.*;

import java.util.List;

public interface LedgerService {
    TransactionResponse createTransaction(Long partyId, TransactionRequest request);
    List<LedgerEntryResponse> getPartyLedger(Long partyId);
    PartySummaryResponse getPartySummary(Long partyId);
}
