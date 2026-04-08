package com.dating.app.services;

import com.dating.app.dto.SwipeRequestDTO;
import com.dating.app.models.Swipe;
import com.dating.app.models.enums.SwipeType;
import com.dating.app.models.User;
import com.dating.app.repositories.SwipeRepository;
import com.dating.app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SwipeService {
    private final SwipeRepository swipeRepository;
    private final UserRepository userRepository;
    private final MatchService matchService;

    @Transactional
    public void performSwipe(User currentUser, SwipeRequestDTO request) {
        User targetUser = userRepository.findById(request.getTargetUserId())
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        // Save swipe
        Swipe swipe = Swipe.builder()
                .fromUserId(currentUser.getId())
                .toUserId(targetUser.getId())
                .swipeType(request.getSwipeType())
                .build();
        swipeRepository.save(swipe);

        // Check for match (if its like)
        if (request.getSwipeType() == SwipeType.LIKE) {
            checkForMatch(currentUser, targetUser);
        }
    }

    private void checkForMatch(User currentUser, User targetUser) {
        // Check if targetUser liked currentUser
        var oppositeSwipe = swipeRepository.findByFromUserIdAndToUserIdAndSwipeType(
                targetUser.getId(),
                currentUser.getId(),
                SwipeType.LIKE
        );

        if (oppositeSwipe.isPresent()) {
            // Match
            matchService.createMatch(currentUser, targetUser);
            // TODO: Notification after match
        }
    }
}