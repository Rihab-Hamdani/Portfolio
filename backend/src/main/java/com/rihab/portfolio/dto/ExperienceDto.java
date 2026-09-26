package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.Experience;

import java.util.List;
import java.util.UUID;

public record ExperienceDto(
        UUID id,
        String organization,
        String role,
        String employmentType,
        String periodLabel,
        String location,
        String summary,
        List<String> responsibilities,
        List<String> technologies,
        String projectSlug,
        int displayOrder) {

    public static ExperienceDto from(Experience e) {
        return new ExperienceDto(e.getId(), e.getOrganization(), e.getRole(), e.getEmploymentType(),
                e.getPeriodLabel(), e.getLocation(), e.getSummary(), List.copyOf(e.getResponsibilities()),
                List.copyOf(e.getTechnologies()), e.getProjectSlug(), e.getDisplayOrder());
    }
}
