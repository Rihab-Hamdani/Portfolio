package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.User;

import java.util.UUID;

public record UserDto(UUID id, String email, String displayName, String role) {

    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getDisplayName(), user.getRole().name());
    }
}
