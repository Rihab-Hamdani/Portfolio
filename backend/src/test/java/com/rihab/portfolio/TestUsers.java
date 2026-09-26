package com.rihab.portfolio;

import com.rihab.portfolio.entity.Role;
import com.rihab.portfolio.entity.User;

import java.util.UUID;

public final class TestUsers {

    private TestUsers() {
    }

    public static User admin(String passwordHash) {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("admin@test.local");
        user.setDisplayName("Test Admin");
        user.setPasswordHash(passwordHash);
        user.setRole(Role.ADMIN);
        user.setEnabled(true);
        return user;
    }
}
