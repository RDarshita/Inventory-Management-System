package com.packerstech.controller;

import com.packerstech.dto.*;
import com.packerstech.service.LedgerService;
import com.packerstech.service.PartyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;
    private final LedgerService ledgerService;

    @PostMapping
    public ResponseEntity<PartyResponse> createParty(@Valid @RequestBody PartyRequest request) {
        return new ResponseEntity<>(partyService.createParty(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PartyResponse>> getAllParties() {
        return ResponseEntity.ok(partyService.getAllParties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartyResponse> getPartyById(@PathVariable Long id) {
        return ResponseEntity.ok(partyService.getPartyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartyResponse> updateParty(@PathVariable Long id, @Valid @RequestBody PartyRequest request) {
        return ResponseEntity.ok(partyService.updateParty(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParty(@PathVariable Long id) {
        partyService.deleteParty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<PartySummaryResponse> getPartySummary(@PathVariable Long id) {
        return ResponseEntity.ok(ledgerService.getPartySummary(id));
    }

    @GetMapping("/{id}/ledger")
    public ResponseEntity<List<LedgerEntryResponse>> getPartyLedger(@PathVariable Long id) {
        return ResponseEntity.ok(ledgerService.getPartyLedger(id));
    }

    @GetMapping("/{id}/outstanding-invoices")
    public ResponseEntity<List<OutstandingInvoiceResponse>> getOutstandingInvoices(@PathVariable Long id) {
        // TODO: Replace with actual fetching logic from Sales module once implemented.
        // Returning empty list for now since Sales module is not yet built.
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }

    @PostMapping("/{id}/transactions")
    public ResponseEntity<TransactionResponse> createTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        return new ResponseEntity<>(ledgerService.createTransaction(id, request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/ledger/pdf")
    public ResponseEntity<byte[]> getLedgerPdf(@PathVariable Long id) {
        byte[] pdfBytes = partyService.generateLedgerPdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ledger.pdf");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
