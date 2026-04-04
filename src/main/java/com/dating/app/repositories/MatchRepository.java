package com.dating.app.repositories;

import com.dating.app.models.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findAllByUserOneIdOrUserTwoId(UUID userOneId, UUID userTwoId);
}
