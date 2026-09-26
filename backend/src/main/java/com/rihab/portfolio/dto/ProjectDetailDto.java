package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.Project;
import com.rihab.portfolio.entity.Technology;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Full case-study representation of a project. */
public record ProjectDetailDto(
        UUID id,
        String slug,
        String title,
        String tagline,
        String summary,
        String context,
        String problem,
        String solution,
        String myRole,
        String architectureDescription,
        List<String> architectureSteps,
        List<String> features,
        List<String> contribution,
        List<String> challenges,
        List<String> learnings,
        List<String> researchQuestions,
        List<ScreenshotDto> screenshots,
        String status,
        List<String> technologies,
        String githubUrl,
        String demoUrl,
        String coverImage,
        boolean featured,
        boolean published,
        int displayOrder,
        Instant updatedAt) {

    public static ProjectDetailDto from(Project p) {
        return new ProjectDetailDto(
                p.getId(), p.getSlug(), p.getTitle(), p.getTagline(), p.getSummary(), p.getContext(),
                p.getProblem(), p.getSolution(), p.getMyRole(), p.getArchitectureDescription(),
                List.copyOf(p.getArchitectureSteps()), List.copyOf(p.getFeatures()), List.copyOf(p.getContribution()),
                List.copyOf(p.getChallenges()), List.copyOf(p.getLearnings()), List.copyOf(p.getResearchQuestions()),
                p.getScreenshots().stream().map(ScreenshotDto::from).toList(),
                p.getStatus() == null ? null : p.getStatus().name(),
                p.getTechnologies().stream().map(Technology::getName).toList(),
                p.getGithubUrl(), p.getDemoUrl(), p.getCoverImage(), p.isFeatured(), p.isPublished(),
                p.getDisplayOrder(), p.getUpdatedAt());
    }
}
