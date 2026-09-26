package com.rihab.portfolio.controller;

import com.rihab.portfolio.dto.ExperienceDto;
import com.rihab.portfolio.dto.LeadershipDto;
import com.rihab.portfolio.dto.SkillDto;
import com.rihab.portfolio.service.ExperienceService;
import com.rihab.portfolio.service.LeadershipService;
import com.rihab.portfolio.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.List;

/** Public, read-only portfolio content. */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContentController {

    private static final CacheControl PUBLIC_CACHE = CacheControl.maxAge(Duration.ofMinutes(1)).cachePublic();

    private final ExperienceService experienceService;
    private final LeadershipService leadershipService;
    private final SkillService skillService;

    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceDto>> experience() {
        return ResponseEntity.ok().cacheControl(PUBLIC_CACHE).body(experienceService.list());
    }

    @GetMapping("/leadership")
    public ResponseEntity<List<LeadershipDto>> leadership() {
        return ResponseEntity.ok().cacheControl(PUBLIC_CACHE).body(leadershipService.list());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> skills() {
        return ResponseEntity.ok().cacheControl(PUBLIC_CACHE).body(skillService.list());
    }
}
