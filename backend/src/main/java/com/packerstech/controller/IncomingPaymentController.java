package com.packerstech.controller;

import com.packerstech.dto.IncomingPaymentRequest;
import com.packerstech.dto.IncomingPaymentResponse;
import com.packerstech.dto.IncomingStatsResponse;
import com.packerstech.service.IncomingPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incoming")
@RequiredArgsConstructor
public class IncomingPaymentController {

    private final IncomingPaymentService incomingPaymentService;

    @GetMapping
    public ResponseEntity<List<IncomingPaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(incomingPaymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomingPaymentResponse> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(incomingPaymentService.getPaymentById(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<IncomingStatsResponse> getStats() {
        return ResponseEntity.ok(incomingPaymentService.getIncomingStats());
    }

    @PostMapping
    public ResponseEntity<IncomingPaymentResponse> createPayment(@Valid @RequestBody IncomingPaymentRequest request) {
        return new ResponseEntity<>(incomingPaymentService.createPayment(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomingPaymentResponse> updatePayment(@PathVariable Long id, @Valid @RequestBody IncomingPaymentRequest request) {
        return ResponseEntity.ok(incomingPaymentService.updatePayment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        incomingPaymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
