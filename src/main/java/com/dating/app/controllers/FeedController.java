package com.dating.app.controllers;

import com.dating.app.dto.UserCardDTO;
import com.dating.app.models.User;
import com.dating.app.services.FeedService;
import com.dating.app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // React
public class FeedController {

    private final FeedService feedService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserCardDTO>> getDiscoveryFeed(@RequestParam UUID userId) {
        // TODO: SpringSecurity

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserCardDTO> feed = feedService.getDiscoveryFeed(currentUser, 20);
        return ResponseEntity.ok(feed);
    }
}