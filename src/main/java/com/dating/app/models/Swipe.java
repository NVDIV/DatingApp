package com.dating.app.models;

import com.dating.app.models.enums.SwipeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "swipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Swipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SwipeType swipeType;

    private java.util.UUID fromUserId;
    private java.util.UUID toUserId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
