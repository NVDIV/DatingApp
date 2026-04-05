package com.dating.app.controllers;

import com.dating.app.dto.SwipeRequestDTO;
import com.dating.app.models.User;
import com.dating.app.repositories.UserRepository;
import com.dating.app.services.SwipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/swipes")
@RequiredArgsConstructor
public class SwipeController {

    private final SwipeService swipeService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<String> performSwipe(
            java.security.Principal principal,
            @RequestBody SwipeRequestDTO request) {

        User currentUser = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        swipeService.performSwipe(currentUser, request);
        return ResponseEntity.ok("Swipe processed successfully");
    }
}