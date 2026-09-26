package com.rihab.portfolio.controller.admin;

import com.rihab.portfolio.dto.ProjectDetailDto;
import com.rihab.portfolio.dto.ProjectRequest;
import com.rihab.portfolio.dto.PublishRequest;
import com.rihab.portfolio.dto.ReorderRequest;
import com.rihab.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
@RequestMapping("/api/admin/projects")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectDetailDto> list() {
        return projectService.listAll();
    }

    @GetMapping("/{id}")
    public ProjectDetailDto get(@PathVariable UUID id) {
        return projectService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDetailDto create(@Valid @RequestBody ProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    public ProjectDetailDto update(@PathVariable UUID id, @Valid @RequestBody ProjectRequest request) {
        return projectService.update(id, request);
    }

    @PatchMapping("/{id}/publish")
    public ProjectDetailDto publish(@PathVariable UUID id, @Valid @RequestBody PublishRequest request) {
        return projectService.setPublished(id, request.published());
    }

    @PutMapping("/order")
    public List<ProjectDetailDto> reorder(@Valid @RequestBody ReorderRequest request) {
        return projectService.reorder(request.ids());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        projectService.delete(id);
    }
}
