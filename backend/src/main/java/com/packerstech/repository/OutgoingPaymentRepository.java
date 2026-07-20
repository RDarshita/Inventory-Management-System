package com.packerstech.repository;

import com.packerstech.entity.OutgoingPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OutgoingPaymentRepository extends JpaRepository<OutgoingPayment, Long> {
}
