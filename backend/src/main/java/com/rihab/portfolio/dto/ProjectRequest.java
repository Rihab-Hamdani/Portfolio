package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.ProjectStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Create / update payload for a project (admin only). */
public record ProjectRequest(
        @NotBlank(message = "Slug is required.")
        @Size(max = 120)
        @Pattern(regexp = "^[a-z0-9]+(-[a-z0-9]+)*$", message = "Use lowercase letters, numbers and hyphens only.")
        String slug,
        @NotBlank(message = "Title is required.") @Size(max = 160) String title,
        @Size(max = 300) String tagline,
        @NotBlank(message = "Summary is required.") @Size(max = 5000) String summary,
        @Size(max = 5000) String context,
        @Size(max = 5000) String problem,
        @Size(max = 5000) String solution,
        @Size(max = 2000) String myRole,
        @Size(max = 5000) String architectureDescription,
        @Size(max = 20) List<@NotBlank @Size(max = 200) String> architectureSteps,
        @Size(max = 40) List<@NotBlank @Size(max = 300) String> features,
        @Size(max = 30) List<@NotBlank @Size(max = 500) String> contribution,
        @Size(max = 30) List<@NotBlank @Size(max = 500) String> challenges,
        @Size(max = 30) List<@NotBlank @Size(max = 500) String> learnings,
        @Size(max = 30) List<@NotBlank @Size(max = 500) String> researchQuestions,
        @Size(max = 30) List<@Valid ScreenshotDto> screenshots,
        @Size(max = 30) List<@NotBlank @Size(max = 80) String> technologies,
        ProjectStatus status,
        @Size(max = 500) @Pattern(regexp = "^$|^https?://.+", message = "Must be an http(s) URL.") String githubUrl,
        @Size(max = 500) @Pattern(regexp = "^$|^https?://.+", message = "Must be an http(s) URL.") String demoUrl,
        @Size(max = 500) String coverImage,
        boolean featured,
        boolean published,
        Integer displayOrder) {
}
