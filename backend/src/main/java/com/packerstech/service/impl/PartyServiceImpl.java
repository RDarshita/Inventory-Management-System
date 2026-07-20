package com.packerstech.service.impl;

import com.packerstech.dto.PartyRequest;
import com.packerstech.dto.PartyResponse;
import com.packerstech.dto.PartySummaryResponse;
import com.packerstech.dto.LedgerEntryResponse;
import com.packerstech.entity.Party;
import com.packerstech.exception.DuplicateResourceException;
import com.packerstech.exception.ResourceNotFoundException;
import com.packerstech.repository.PartyRepository;
import com.packerstech.service.PartyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartyServiceImpl implements PartyService {

    private final PartyRepository partyRepository;

    @Override
    public PartyResponse createParty(PartyRequest request) {
        if (partyRepository.existsByGstin(request.getGstin())) {
            throw new DuplicateResourceException("Party with GSTIN " + request.getGstin() + " already exists.");
        }
        Party party = mapToEntity(request);
        Party saved = partyRepository.save(party);
        return mapToResponse(saved);
    }

    @Override
    public PartyResponse updateParty(Long id, PartyRequest request) {
        Party existing = partyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + id));

        if (!existing.getGstin().equals(request.getGstin()) && partyRepository.existsByGstin(request.getGstin())) {
            throw new DuplicateResourceException("Party with GSTIN " + request.getGstin() + " already exists.");
        }

        existing.setCompanyName(request.getCompanyName());
        existing.setGstin(request.getGstin());
        existing.setCompanyAddress(request.getCompanyAddress());
        existing.setPincode(request.getPincode());
        existing.setStateCode(request.getStateCode());
        existing.setPhoneNo(request.getPhoneNo());
        existing.setEmail(request.getEmail());
        existing.setPaymentPeriodDays(request.getPaymentPeriodDays());
        existing.setNotes(request.getNotes());

        Party updated = partyRepository.save(existing);
        return mapToResponse(updated);
    }

    @Override
    public void deleteParty(Long id) {
        Party party = partyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + id));
        partyRepository.delete(party);
    }

    @Override
    public PartyResponse getPartyById(Long id) {
        Party party = partyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + id));
        return mapToResponse(party);
    }

    @Override
    public List<PartyResponse> getAllParties() {
        return partyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PartySummaryResponse getPartySummary(Long id) {
        PartyResponse party = getPartyById(id);

        // TODO: Calculate totalSales from Sales table once Sales module is implemented
        double totalSales = 0.0;

        // TODO: Calculate totalReceived from Incoming/Payments table once implemented
        double totalReceived = 0.0;

        // TODO: pendingAmount = totalSales - totalReceived (once real data exists)
        double pendingAmount = totalSales - totalReceived;

        // TODO: dueAmount = sum of overdue invoices based on paymentPeriodDays
        double dueAmount = 0.0;

        return PartySummaryResponse.builder()
                .party(party)
                .totalSales(totalSales)
                .totalReceived(totalReceived)
                .pendingAmount(pendingAmount)
                .dueAmount(dueAmount)
                .build();
    }

    @Override
    public List<LedgerEntryResponse> getPartyLedger(Long id) {
        // Validate party exists
        getPartyById(id);

        // TODO: Query ledger entries from Sales + Incoming tables once implemented
        return Collections.emptyList();
    }

    @Override
    public byte[] generateLedgerPdf(Long id) {
        PartyResponse party = getPartyById(id);

        // TODO: Replace with a proper PDF library (iText / Apache PDFBox) once ledger data exists
        // For now, generate a minimal valid PDF as a placeholder
        String pdfContent = "%PDF-1.4\n" +
                "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
                "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
                "3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>>>endobj\n" +
                "4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n" +
                "5 0 obj<</Length 44>>stream\n" +
                "BT /F1 16 Tf 100 700 Td (Ledger - " + party.getCompanyName() + ") Tj ET\n" +
                "endstream\nendobj\n" +
                "xref\n0 6\n" +
                "0000000000 65535 f \n" +
                "0000000009 00000 n \n" +
                "0000000058 00000 n \n" +
                "0000000115 00000 n \n" +
                "0000000266 00000 n \n" +
                "0000000340 00000 n \n" +
                "trailer<</Size 6/Root 1 0 R>>\n" +
                "startxref\n434\n%%EOF";

        return pdfContent.getBytes(StandardCharsets.UTF_8);
    }

    private Party mapToEntity(PartyRequest request) {
        return Party.builder()
                .companyName(request.getCompanyName())
                .gstin(request.getGstin())
                .companyAddress(request.getCompanyAddress())
                .pincode(request.getPincode())
                .stateCode(request.getStateCode())
                .phoneNo(request.getPhoneNo())
                .email(request.getEmail())
                .paymentPeriodDays(request.getPaymentPeriodDays())
                .notes(request.getNotes())
                .build();
    }

    private PartyResponse mapToResponse(Party party) {
        return PartyResponse.builder()
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
    }
}

