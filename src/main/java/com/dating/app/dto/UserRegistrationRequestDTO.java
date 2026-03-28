package com.dating.app.dto;

import com.dating.app.models.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRegistrationRequestDTO {
    private String email;
    private String password;
    private String name;
    private LocalDate birthday;
    private Gender gender;
    private Gender targetGender;
    private String city;
}
