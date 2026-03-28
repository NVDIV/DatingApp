package com.dating.app.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserCardDTO {
    private UUID id;
    private String name;
    private int age; // Calculate from birthday
    private String mainPhotoUrl;
    private Integer mainArcana;
    private Integer compatibilityPercent; // Calculated on the fly!
    private String pairArcanaName;        // Calculated on the fly!
}
