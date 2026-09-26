package com.rihab.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ExperienceRequest(
        @NotBlank(message = "Organization is required.") @Size(max = 160) String organization,
        @NotBlank(message = "Role is required.") @Size(max = 160) String role,
        @Size(max = 60) String employmentType,
        @Size(max = 80) String periodLabel,
        @Size(max = 120) String location,
        @Size(max = 3000) String summary,
        @Size(max = 30) List<@NotBlank @Size(max = 500) String> responsibilities,
        @Size(max = 30) List<@NotBlank @Size(max = 80) String> technologies,
        @Size(max = 120) String projectSlug,
        Integer displayOrder) {
}
