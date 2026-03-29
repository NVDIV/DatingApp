package com.dating.app.services;

import com.dating.app.engine.ArcanaCalculator;
import com.dating.app.models.Match;
import com.dating.app.models.User;
import com.dating.app.repositories.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final ArcanaCalculator arcanaCalculator;

    public Match createMatch(User user1, User user2) {
        // Calculate pair arcana
        Integer pairArcana = arcanaCalculator.calculateCompatibility(
                user1.getMainArcana(),
                user2.getMainArcana()
        );

        Match match = Match.builder()
                .userOneId(user1.getId())
                .userTwoId(user2.getId())
                .pairArcana(pairArcana)
                .build();

        return matchRepository.save(match);
    }
}