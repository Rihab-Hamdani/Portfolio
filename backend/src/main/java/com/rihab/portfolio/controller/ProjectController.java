package com.rihab.portfolio.controller;

import com.rihab.portfolio.dto.ProjectDetailDto;
import com.rihab.portfolio.dto.ProjectSummaryDto;
import com.rihab.portfolio.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private static final CacheControl PUBLIC_CACHE = CacheControl.maxAge(Duration.ofMinutes(1)).cachePublic();

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectSummaryDto>> list() {
        return ResponseEntity.ok().cacheControl(PUBLIC_CACHE).body(projectService.listPublished());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProjectDetailDto> get(@PathVariable String slug) {
        return ResponseEntity.ok().cacheControl(PUBLIC_CACHE).body(projectService.getPublishedBySlug(slug));
    }
}
