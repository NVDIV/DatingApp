package com.dating.app.repositories;

import com.dating.app.models.Swipe;
import com.dating.app.models.enums.SwipeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SwipeRepository extends JpaRepository<Swipe, Long> {
    List<Swipe> findAllByFromUserId(UUID fromUserId);
    Optional<Swipe> findByFromUserIdAndToUserIdAndSwipeType(UUID fromUserId, UUID toUserId, SwipeType type);
}
