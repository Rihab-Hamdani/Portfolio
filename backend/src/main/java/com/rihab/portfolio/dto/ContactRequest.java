package com.rihab.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Public contact form payload. {@code website} is a honeypot field: it is hidden from humans,
 * so any value means the submission came from a bot.
 */
public record ContactRequest(
        @NotBlank(message = "Please enter your name.")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters.")
        String name,
        @NotBlank(message = "Please enter your email.")
        @Email(message = "Please enter a valid email address.")
        @Size(max = 254, message = "Email is too long.")
        String email,
        @NotBlank(message = "Please enter a subject.")
        @Size(min = 3, max = 150, message = "Subject must be between 3 and 150 characters.")
        String subject,
        @NotBlank(message = "Please write a message.")
        @Size(min = 10, max = 5000, message = "Message must be between 10 and 5000 characters.")
        String message,
        @Size(max = 200)
        String website) {
}
