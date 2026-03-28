package com.dating.app.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRegistrationRequestDTO {
    private String email;
    private String password;
    private String name;
    private LocalDate birthday;
    private String gender;
    private String targetGender;
    private String city;
}
