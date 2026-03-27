package com.dating.app.repositories;

import com.dating.app.models.Swipe;

import java.util.List;
import java.util.UUID;

public interface SwipeRepository {
    List<Swipe> findAllByFromUserId(UUID fromUserId);
    boolean existsByFromUserIdAndToUserIdAndSwipeType(UUID from, UUID to, String type);
}
