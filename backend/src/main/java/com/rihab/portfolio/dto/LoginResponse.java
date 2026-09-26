package com.rihab.portfolio.dto;

import java.time.Instant;

public record LoginResponse(String token, Instant expiresAt, UserDto user) {
}
