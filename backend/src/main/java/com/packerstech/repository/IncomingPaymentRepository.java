package com.packerstech.repository;

import com.packerstech.entity.IncomingPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncomingPaymentRepository extends JpaRepository<IncomingPayment, Long> {
    
    List<IncomingPayment> findAllByOrderByPaymentDateDesc();
    
    List<IncomingPayment> findByPartyId(Long partyId);
    
    @Query("SELECT COALESCE(SUM(ip.amount), 0) FROM IncomingPayment ip WHERE ip.party.id = :partyId")
    Double sumAmountByPartyId(@Param("partyId") Long partyId);
}
