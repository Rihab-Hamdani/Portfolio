package com.rihab.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record AnalyticsEventRequest(
        @NotBlank
        @Pattern(regexp = "^(page_view|project_view|resume_download|contact_submit|github_click|linkedin_click)$",
                message = "Unknown event type.")
        String eventType,
        @Size(max = 255) String page,
        @Size(max = 120) String projectSlug,
        @Size(max = 10) Map<String, Object> metadata) {
}
