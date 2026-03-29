package com.dating.app.services;

import com.dating.app.dto.UserCardDTO;
import com.dating.app.engine.ArcanaCalculator;
import com.dating.app.models.Photo;
import com.dating.app.models.Swipe;
import com.dating.app.models.User;
import com.dating.app.repositories.ArcanaMeaningRepository;
import com.dating.app.repositories.SwipeRepository;
import com.dating.app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final UserRepository userRepository;
    private final SwipeRepository swipeRepository;
    private final ArcanaMeaningRepository arcanaMeaningRepository;
    private final ArcanaCalculator arcanaCalculator;

    public List<UserCardDTO> getDiscoveryFeed(User currentUser, int pageSize) {
        // Get swiped users
        List<UUID> swipedUserIds = swipeRepository.findAllByFromUserId(currentUser.getId())
                .stream()
                .map(Swipe::getToUserId)
                .collect(Collectors.toList());

        // Add user itself
        swipedUserIds.add(currentUser.getId());

        // Get 50 users (by last activity)
        Pageable pageable = PageRequest.of(0, 50);
        Page<User> candidatePage = userRepository.findByGenderAndCityAndIdNotInOrderByLastActiveDesc(
                currentUser.getTargetGender(),
                currentUser.getCity(),
                swipedUserIds,
                pageable
        );

        // Convert to list
        List<User> candidates = new ArrayList<>(candidatePage.getContent());

        // Shuffle list of users
        Collections.shuffle(candidates);

        // Limit by pageSize and return
        return candidates.stream()
                .limit(pageSize)
                .map(candidate -> buildUserCard(currentUser, candidate))
                .collect(Collectors.toList());
    }

    // Build User card
    private UserCardDTO buildUserCard(User currentUser, User candidate) {
        UserCardDTO card = new UserCardDTO();
        card.setId(candidate.getId());
        card.setName(candidate.getName());

        // Calculate birthday
        if (candidate.getBirthday() != null) {
            card.setAge(Period.between(candidate.getBirthday(), LocalDate.now()).getYears());
        }

        // Set candidate's main arcana
        card.setMainArcana(candidate.getMainArcana());

        // Calculate pair arcana
        Integer pairArcana = arcanaCalculator.calculateCompatibility(
                currentUser.getMainArcana(),
                candidate.getMainArcana()
        );

        // Get Arcana from DB
        var arcanaMeaning = arcanaMeaningRepository.findByArcaneNumber(pairArcana)
                .orElseThrow(() -> new RuntimeException("Arcana not found in DB for number: " + pairArcana));

        // Set pair arcana and compatability
        card.setPairArcanaName(arcanaMeaning.getName());
        card.setPairDescription(arcanaMeaning.getPairDescription());
        card.setCompatibilityPercent(arcanaMeaning.getCompatibilityPercent());

        // Set main photo
        String mainPhotoUrl = "default-avatar.png";
        if (candidate.getPhotos() != null) {
            mainPhotoUrl = candidate.getPhotos().stream()
                    .filter(Photo::isMain)
                    .map(Photo::getUrl)
                    .findFirst()
                    .orElse("default-avatar.png");
        }
        card.setMainPhotoUrl(mainPhotoUrl);

        return card;
    }
}