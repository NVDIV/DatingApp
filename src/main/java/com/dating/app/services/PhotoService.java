package com.dating.app.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotoService {
    void uploadPhoto(UUID userId, String url) {
        // TODO
    }

    void setMainPhoto(UUID userId, Long photoId) {
        // TODO
    }

    void deletePhoto(Long photoId) {
        // TODO
    }
}
