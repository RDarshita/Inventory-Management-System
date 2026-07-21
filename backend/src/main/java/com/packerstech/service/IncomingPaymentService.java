package com.packerstech.service;

import com.packerstech.dto.IncomingPaymentRequest;
import com.packerstech.dto.IncomingPaymentResponse;
import com.packerstech.dto.IncomingStatsResponse;

import java.util.List;

public interface IncomingPaymentService {
    IncomingPaymentResponse createPayment(IncomingPaymentRequest request);
    IncomingPaymentResponse updatePayment(Long id, IncomingPaymentRequest request);
    void deletePayment(Long id);
    IncomingPaymentResponse getPaymentById(Long id);
    List<IncomingPaymentResponse> getAllPayments();
    IncomingStatsResponse getIncomingStats();
}
