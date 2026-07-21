package com.packerstech.service.impl;

import com.packerstech.dto.IncomingPaymentRequest;
import com.packerstech.dto.IncomingPaymentResponse;
import com.packerstech.dto.IncomingStatsResponse;
import com.packerstech.entity.IncomingPayment;
import com.packerstech.entity.Party;
import com.packerstech.exception.ResourceNotFoundException;
import com.packerstech.repository.IncomingPaymentRepository;
import com.packerstech.repository.PartyRepository;
import com.packerstech.service.IncomingPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomingPaymentServiceImpl implements IncomingPaymentService {

    private final IncomingPaymentRepository incomingPaymentRepository;
    private final PartyRepository partyRepository;

    @Override
    public IncomingPaymentResponse createPayment(IncomingPaymentRequest request) {
        Party party = partyRepository.findById(request.getPartyId())
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + request.getPartyId()));

        IncomingPayment payment = IncomingPayment.builder()
                .party(party)
                .amount(request.getAmountReceived())
                .paymentDate(request.getPaymentDate())
                .referenceNo(request.getTransactionId())
                .notes(request.getNotes())
                .paymentMode("DEFAULT")
                .build();

        IncomingPayment saved = incomingPaymentRepository.save(payment);
        return mapToResponse(saved);
    }

    @Override
    public IncomingPaymentResponse updatePayment(Long id, IncomingPaymentRequest request) {
        IncomingPayment existing = incomingPaymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        Party party = partyRepository.findById(request.getPartyId())
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + request.getPartyId()));

        existing.setParty(party);
        existing.setAmount(request.getAmountReceived());
        existing.setPaymentDate(request.getPaymentDate());
        existing.setReferenceNo(request.getTransactionId());
        existing.setNotes(request.getNotes());

        IncomingPayment updated = incomingPaymentRepository.save(existing);
        return mapToResponse(updated);
    }

    @Override
    public void deletePayment(Long id) {
        IncomingPayment payment = incomingPaymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        incomingPaymentRepository.delete(payment);
    }

    @Override
    public IncomingPaymentResponse getPaymentById(Long id) {
        IncomingPayment payment = incomingPaymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return mapToResponse(payment);
    }

    @Override
    public List<IncomingPaymentResponse> getAllPayments() {
        return incomingPaymentRepository.findAllByOrderByPaymentDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public IncomingStatsResponse getIncomingStats() {
        List<IncomingPayment> all = incomingPaymentRepository.findAll();

        BigDecimal totalReceived = BigDecimal.ZERO;
        BigDecimal receivedThisMonth = BigDecimal.ZERO;

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);

        for (IncomingPayment ip : all) {
            totalReceived = totalReceived.add(ip.getAmount());
            if (!ip.getPaymentDate().isBefore(startOfMonth)) {
                receivedThisMonth = receivedThisMonth.add(ip.getAmount());
            }
        }

        // pendingAmount and dueAmount depend on sales invoices which aren't fully implemented yet.
        // We will default them to 0 as requested by the plan.
        BigDecimal pendingAmount = BigDecimal.ZERO;
        BigDecimal dueAmount = BigDecimal.ZERO;

        return IncomingStatsResponse.builder()
                .totalReceived(totalReceived)
                .receivedThisMonth(receivedThisMonth)
                .pendingAmount(pendingAmount)
                .dueAmount(dueAmount)
                .build();
    }

    private IncomingPaymentResponse mapToResponse(IncomingPayment payment) {
        return IncomingPaymentResponse.builder()
                .id(payment.getId())
                .partyId(payment.getParty().getId())
                .partyName(payment.getParty().getCompanyName())
                .gstin(payment.getParty().getGstin())
                .transactionId(payment.getReferenceNo())
                .paymentDate(payment.getPaymentDate())
                .amountReceived(payment.getAmount())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
