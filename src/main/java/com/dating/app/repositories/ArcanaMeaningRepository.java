package com.dating.app.repositories;

import com.dating.app.models.ArcanaMeaning;

import java.util.Optional;

public interface ArcanaMeaningRepository {
    Optional<ArcanaMeaning> findByArcaneNumber(Integer number);
}
