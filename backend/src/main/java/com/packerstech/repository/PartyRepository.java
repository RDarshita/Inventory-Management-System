package com.packerstech.repository;

import com.packerstech.entity.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartyRepository extends JpaRepository<Party, Long> {

    Optional<Party> findByGstin(String gstin);

    boolean existsByGstin(String gstin);
}
