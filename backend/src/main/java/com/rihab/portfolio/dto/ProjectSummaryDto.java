package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.Project;
import com.rihab.portfolio.entity.Technology;

import java.util.List;
import java.util.UUID;

/** Lightweight representation used on the homepage project grid. */
public record ProjectSummaryDto(
        UUID id,
        String slug,
        String title,
        String tagline,
        String summary,
        String status,
        List<String> technologies,
        String coverImage,
        String githubUrl,
        String demoUrl,
        boolean featured,
        int displayOrder) {

    public static ProjectSummaryDto from(Project p) {
        return new ProjectSummaryDto(
                p.getId(), p.getSlug(), p.getTitle(), p.getTagline(), p.getSummary(),
                p.getStatus() == null ? null : p.getStatus().name(),
                p.getTechnologies().stream().map(Technology::getName).toList(),
                p.getCoverImage(), p.getGithubUrl(), p.getDemoUrl(), p.isFeatured(), p.getDisplayOrder());
    }
}
