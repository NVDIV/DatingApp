package com.dating.app.repositories;

import com.dating.app.models.ArcanaMeaning;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArcanaMeaningRepository extends JpaRepository<ArcanaMeaning, Integer> {
    Optional<ArcanaMeaning> findByArcanaNumber(Integer number);
}
