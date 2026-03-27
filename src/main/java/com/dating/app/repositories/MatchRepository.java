package com.dating.app.repositories;

import com.dating.app.models.Match;

import java.util.List;
import java.util.UUID;

public interface MatchRepository {
    List<Match> findAllByUser1IdOrUser2Id(UUID id1, UUID id2);
}
