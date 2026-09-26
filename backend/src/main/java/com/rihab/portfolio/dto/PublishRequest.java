package com.rihab.portfolio.dto;

import jakarta.validation.constraints.NotNull;

public record PublishRequest(@NotNull Boolean published) {
}
