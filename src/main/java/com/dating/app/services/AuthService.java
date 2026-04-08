package com.dating.app.services;

import com.dating.app.dto.LoginRequestDTO;
import com.dating.app.dto.UserRegistrationRequestDTO;
import com.dating.app.engine.ArcanaCalculator;
import com.dating.app.models.User;
import com.dating.app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final ArcanaCalculator arcanaCalculator;

    // TODO: Add Spring Security
    // private final PasswordEncoder passwordEncoder;

    public User register(UserRegistrationRequestDTO request) {
        // Check for the email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists!");
        }

        // Calculate Arcana
        Integer calculatedArcana = arcanaCalculator.calculatePersonalArcana(request.getBirthday());

        // Create new User
        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(request.getPassword()) // TODO: Add Spring Security
                .name(request.getName())
                .birthday(request.getBirthday())
                .gender(request.getGender())
                .targetGender(request.getTargetGender())
                .city(request.getCity())
                .mainArcana(calculatedArcana)
                .lastActive(LocalDateTime.now()) // Set last activity
                .build();

        // Save new User
        return userRepository.save(newUser);
    }

    public User login(LoginRequestDTO request) {
        // Find User
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check for password
        if (!request.getPassword().equals(user.getPasswordHash())) { // TODO: Add Spring Security
            throw new RuntimeException("Invalid email or password");
        }

        // Set Last Activity
        user.setLastActive(LocalDateTime.now());

        // Save new User state
        return userRepository.save(user);
    }
}
