package com.dating.app.repositories;

import com.dating.app.models.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findAllByUserId(UUID userId);
    Optional<Photo> findByUserIdAndIsMainTrue(UUID userId);
}