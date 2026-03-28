package com.dating.app.repositories;

import com.dating.app.models.Swipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SwipeRepository extends JpaRepository<Swipe, Long> {
    List<Swipe> findAllByFromUserId(UUID fromUserId);
    boolean existsByFromUserIdAndToUserIdAndSwipeType(UUID from, UUID to, String type);
}
