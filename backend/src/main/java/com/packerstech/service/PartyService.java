package com.packerstech.service;

import com.packerstech.dto.PartyRequest;
import com.packerstech.dto.PartyResponse;
import com.packerstech.dto.PartySummaryResponse;
import com.packerstech.dto.LedgerEntryResponse;

import java.util.List;

public interface PartyService {
    PartyResponse createParty(PartyRequest request);
    PartyResponse updateParty(Long id, PartyRequest request);
    void deleteParty(Long id);
    PartyResponse getPartyById(Long id);
    List<PartyResponse> getAllParties();
    PartySummaryResponse getPartySummary(Long id);
    List<LedgerEntryResponse> getPartyLedger(Long id);
    byte[] generateLedgerPdf(Long id);
}
