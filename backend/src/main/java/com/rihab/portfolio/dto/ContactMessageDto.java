package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.ContactMessage;

import java.time.Instant;
import java.util.UUID;

public record ContactMessageDto(UUID id, String name, String email, String subject, String message, String status,
                                Instant createdAt) {

    public static ContactMessageDto from(ContactMessage m) {
        return new ContactMessageDto(m.getId(), m.getName(), m.getEmail(), m.getSubject(), m.getMessage(),
                m.getStatus().name(), m.getCreatedAt());
    }
}
