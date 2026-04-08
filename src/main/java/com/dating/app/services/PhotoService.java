package com.dating.app.services;

import com.dating.app.models.Photo;
import com.dating.app.models.User;
import com.dating.app.repositories.PhotoRepository;
import com.dating.app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    @Transactional
    public void uploadPhoto(UUID userId, String url) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If its first photo - make it main
        List<Photo> existingPhotos = photoRepository.findAllByUserId(userId);
        boolean isFirst = existingPhotos.isEmpty();

        Photo photo = Photo.builder()
                .url(url)
                .isMain(isFirst)
                .user(user)
                .build();

        photoRepository.save(photo);
    }

    @Transactional
    public void setMainPhoto(UUID userId, Long photoId) {
        // Find all user photos
        List<Photo> userPhotos = photoRepository.findAllByUserId(userId);

        // Set main photo
        userPhotos.forEach(p -> {
            p.setMain(p.getId().equals(photoId));
        });

        // Save
        photoRepository.saveAll(userPhotos);
    }

    @Transactional
    public void deletePhoto(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        // Set other photo main
        if (photo.isMain()) {
            UUID userId = photo.getUser().getId();
            photoRepository.delete(photo);

            photoRepository.findAllByUserId(userId).stream()
                    .findFirst()
                    .ifPresent(p -> {
                        p.setMain(true);
                        photoRepository.save(p);
                    });
        } else {
            photoRepository.delete(photo);
        }
    }
}