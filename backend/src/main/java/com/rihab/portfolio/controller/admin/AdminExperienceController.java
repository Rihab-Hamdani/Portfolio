package com.rihab.portfolio.controller.admin;

import com.rihab.portfolio.dto.ExperienceDto;
import com.rihab.portfolio.dto.ExperienceRequest;
import com.rihab.portfolio.service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/experience")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminExperienceController {

    private final ExperienceService service;

    @GetMapping
    public List<ExperienceDto> list() {
        return service.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceDto create(@Valid @RequestBody ExperienceRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ExperienceDto update(@PathVariable UUID id, @Valid @RequestBody ExperienceRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
