package com.dating.app.dto;

import com.dating.app.models.User;
import com.dating.app.models.enums.Gender;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserResponseDTO {
    private UUID id;
    private String email;
    private String name;
    private Integer age;
    private String city;
    private Gender gender;
    private Integer mainArcana;
    private List<PhotoDTO> photos;

    public static UserResponseDTO fromEntity(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .city(user.getCity())
                .gender(user.getGender())
                .mainArcana(user.getMainArcana())
                .photos(user.getPhotos() == null ? List.of() : user.getPhotos().stream()
                        .map(p -> PhotoDTO.builder()
                                .id(p.getId())
                                .url(p.getUrl())
                                .isMain(p.isMain())
                                .build())
                        .toList())
                .build();
    }
}