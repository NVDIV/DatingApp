package com.dating.app.dto;

import com.dating.app.models.enums.SwipeType;
import lombok.Data;

import java.util.UUID;

@Data
public class SwipeRequestDTO {
    private UUID targetUserId;
    private SwipeType swipeType;
}