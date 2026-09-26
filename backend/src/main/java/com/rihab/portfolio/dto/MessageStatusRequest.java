package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.MessageStatus;
import jakarta.validation.constraints.NotNull;

public record MessageStatusRequest(@NotNull(message = "Status is required.") MessageStatus status) {
}
