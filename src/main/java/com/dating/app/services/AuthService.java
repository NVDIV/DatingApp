package com.dating.app.services;

import com.dating.app.dto.AuthResponseDTO;
import com.dating.app.dto.LoginRequestDTO;
import com.dating.app.dto.UserRegistrationRequestDTO;
import com.dating.app.engine.ArcanaCalculator;
import com.dating.app.models.User;
import com.dating.app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final ArcanaCalculator arcanaCalculator;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO register(UserRegistrationRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists!");
        }

        Integer calculatedArcana = arcanaCalculator.calculatePersonalArcana(request.getBirthday());

        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .birthday(request.getBirthday())
                .gender(request.getGender())
                .targetGender(request.getTargetGender())
                .city(request.getCity())
                .mainArcana(calculatedArcana)
                .lastActive(LocalDateTime.now())
                .build();

        userRepository.save(newUser);

        // Generate token after registration
        String jwtToken = jwtService.generateToken(newUser.getEmail());

        return AuthResponseDTO.builder()
                .token(jwtToken)
                .userId(newUser.getId())
                .name(newUser.getName())
                .email(newUser.getEmail())
                .build();
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());

        return AuthResponseDTO.builder()
                .token(jwtToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}