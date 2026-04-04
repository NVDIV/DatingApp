package com.dating.app.controllers;

import com.dating.app.dto.LoginRequestDTO;
import com.dating.app.dto.UserRegistrationRequestDTO;
import com.dating.app.dto.UserResponseDTO;
import com.dating.app.models.User;
import com.dating.app.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRegistrationRequestDTO request) {
        User user = authService.register(request);
        return ResponseEntity.ok(UserResponseDTO.fromEntity(user));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody LoginRequestDTO request) {
        User user = authService.login(request);
        return ResponseEntity.ok(UserResponseDTO.fromEntity(user));
    }
}