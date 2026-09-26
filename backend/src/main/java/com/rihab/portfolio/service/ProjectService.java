package com.rihab.portfolio.service;

import com.rihab.portfolio.dto.ProjectDetailDto;
import com.rihab.portfolio.dto.ProjectRequest;
import com.rihab.portfolio.dto.ProjectSummaryDto;
import com.rihab.portfolio.dto.ScreenshotDto;
import com.rihab.portfolio.entity.Project;
import com.rihab.portfolio.entity.Technology;
import com.rihab.portfolio.exception.BadRequestException;
import com.rihab.portfolio.exception.ConflictException;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.ProjectRepository;
import com.rihab.portfolio.repository.TechnologyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.rihab.portfolio.util.InputSanitizer.blankToNull;
import static com.rihab.portfolio.util.InputSanitizer.cleanList;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TechnologyRepository technologyRepository;

    // ---------- Public ----------

    @Transactional(readOnly = true)
    public List<ProjectSummaryDto> listPublished() {
        return projectRepository.findAllByPublishedTrueOrderByDisplayOrderAscCreatedAtAsc().stream()
                .map(ProjectSummaryDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDetailDto getPublishedBySlug(String slug) {
        return projectRepository.findBySlugAndPublishedTrue(slug)
                .map(ProjectDetailDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found."));
    }

    // ---------- Admin ----------

    @Transactional(readOnly = true)
    public List<ProjectDetailDto> listAll() {
        return projectRepository.findAllByOrderByDisplayOrderAscCreatedAtAsc().stream()
                .map(ProjectDetailDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDetailDto getById(UUID id) {
        return ProjectDetailDto.from(find(id));
    }

    @Transactional
    public ProjectDetailDto create(ProjectRequest request) {
        if (projectRepository.existsBySlug(request.slug())) {
            throw new ConflictException("A project with this slug already exists.");
        }
        Project project = new Project();
        apply(project, request);
        if (request.displayOrder() == null) {
            project.setDisplayOrder((int) projectRepository.count() + 1);
        }
        project.setTechnologies(resolveTechnologies(request.technologies()));
        return ProjectDetailDto.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectDetailDto update(UUID id, ProjectRequest request) {
        Project project = find(id);
        if (projectRepository.existsBySlugAndIdNot(request.slug(), id)) {
            throw new ConflictException("A project with this slug already exists.");
        }
        apply(project, request);
        // Clear first and flush, so re-ordered technologies never collide on the join-table primary key.
        project.getTechnologies().clear();
        projectRepository.saveAndFlush(project);
        project.getTechnologies().addAll(resolveTechnologies(request.technologies()));
        return ProjectDetailDto.from(projectRepository.save(project));
    }

    @Transactional
    public void delete(UUID id) {
        projectRepository.delete(find(id));
    }

    @Transactional
    public ProjectDetailDto setPublished(UUID id, boolean published) {
        Project project = find(id);
        project.setPublished(published);
        return ProjectDetailDto.from(project);
    }

    /** Applies the given order: position in the list becomes display_order (1-based). */
    @Transactional
    public List<ProjectDetailDto> reorder(List<UUID> orderedIds) {
        Set<UUID> unique = new HashSet<>(orderedIds);
        if (unique.size() != orderedIds.size()) {
            throw new BadRequestException("The order contains duplicate ids.");
        }
        List<Project> all = projectRepository.findAll();
        if (all.size() != orderedIds.size() || !all.stream().map(Project::getId).collect(Collectors.toSet()).equals(unique)) {
            throw new BadRequestException("The order must contain every project exactly once.");
        }
        Map<UUID, Project> byId = all.stream().collect(Collectors.toMap(Project::getId, Function.identity()));
        for (int i = 0; i < orderedIds.size(); i++) {
            byId.get(orderedIds.get(i)).setDisplayOrder(i + 1);
        }
        projectRepository.flush();
        return listAll();
    }

    // ---------- Helpers ----------

    private Project find(UUID id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found."));
    }

    private void apply(Project project, ProjectRequest r) {
        project.setSlug(r.slug().trim());
        project.setTitle(r.title().trim());
        project.setTagline(blankToNull(r.tagline()));
        project.setSummary(r.summary().trim());
        project.setContext(blankToNull(r.context()));
        project.setProblem(blankToNull(r.problem()));
        project.setSolution(blankToNull(r.solution()));
        project.setMyRole(blankToNull(r.myRole()));
        project.setArchitectureDescription(blankToNull(r.architectureDescription()));
        project.setArchitectureSteps(cleanList(r.architectureSteps()));
        project.setFeatures(cleanList(r.features()));
        project.setContribution(cleanList(r.contribution()));
        project.setChallenges(cleanList(r.challenges()));
        project.setLearnings(cleanList(r.learnings()));
        project.setResearchQuestions(cleanList(r.researchQuestions()));
        project.setScreenshots(r.screenshots() == null ? new ArrayList<>()
                : r.screenshots().stream().map(ScreenshotDto::toEntity).collect(Collectors.toCollection(ArrayList::new)));
        project.setStatus(r.status());
        project.setGithubUrl(blankToNull(r.githubUrl()));
        project.setDemoUrl(blankToNull(r.demoUrl()));
        project.setCoverImage(blankToNull(r.coverImage()));
        project.setFeatured(r.featured());
        project.setPublished(r.published());
        if (r.displayOrder() != null) {
            project.setDisplayOrder(r.displayOrder());
        }
    }

    private List<Technology> resolveTechnologies(List<String> names) {
        List<Technology> result = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();
        for (String raw : cleanList(names)) {
            if (!seen.add(raw.toLowerCase())) {
                continue;
            }
            Technology technology = technologyRepository.findByNameIgnoreCase(raw)
                    .orElseGet(() -> technologyRepository.save(new Technology(raw)));
            result.add(technology);
        }
        return result;
    }
}
