package com.dating.app.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "arcana_meanings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArcanaMeaning {
    @Id
    private Integer arcanaNumber; // 1-22

    private String name;

    @Column(columnDefinition = "TEXT")
    private String personalDescription;

    @Column(columnDefinition = "TEXT")
    private String pairDescription;

    private Integer compatibilityPercent;
}
