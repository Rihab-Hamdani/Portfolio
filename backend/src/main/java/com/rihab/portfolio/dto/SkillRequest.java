package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.SkillCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SkillRequest(
        @NotBlank(message = "Name is required.") @Size(max = 80) String name,
        @NotNull(message = "Category is required.") SkillCategory category,
        @Size(max = 300) String description,
        @Size(max = 60) String icon,
        Integer displayOrder) {
}
