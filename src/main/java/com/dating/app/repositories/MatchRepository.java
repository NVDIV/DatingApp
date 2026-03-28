package com.dating.app.repositories;

import com.dating.app.models.Match;
import com.dating.app.models.Swipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findAllByUser1IdOrUser2Id(UUID id1, UUID id2);
}
