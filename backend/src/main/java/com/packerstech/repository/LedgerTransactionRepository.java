package com.packerstech.repository;

import com.packerstech.entity.LedgerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LedgerTransactionRepository extends JpaRepository<LedgerTransaction, Long> {

    List<LedgerTransaction> findByPartyIdOrderByTransactionDateDescCreatedAtDesc(Long partyId);

    @Query("SELECT COALESCE(SUM(lt.amount), 0) FROM LedgerTransaction lt WHERE lt.party.id = :partyId AND lt.transactionType = :type")
    Double sumAmountByPartyIdAndType(@Param("partyId") Long partyId, @Param("type") String type);
}
