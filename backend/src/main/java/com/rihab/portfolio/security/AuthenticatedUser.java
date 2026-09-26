package com.rihab.portfolio.security;

import java.util.UUID;

/** Principal stored in the SecurityContext after a JWT has been validated. */
public record AuthenticatedUser(UUID id, String email, String role) {
}
