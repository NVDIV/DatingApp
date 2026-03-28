package com.dating.app.services;

import com.dating.app.dto.LoginRequestDTO;
import com.dating.app.dto.UserRegistrationRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    // Should registration return some sort of succes/error
    void register(UserRegistrationRequestDTO request) {
        // TODO
    }
    void login(LoginRequestDTO request) {
        // TODO
    }
}
