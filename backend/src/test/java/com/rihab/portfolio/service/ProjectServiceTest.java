package com.rihab.portfolio.service;

import com.rihab.portfolio.dto.ProjectDetailDto;
import com.rihab.portfolio.dto.ProjectRequest;
import com.rihab.portfolio.dto.ProjectSummaryDto;
import com.rihab.portfolio.entity.Project;
import com.rihab.portfolio.entity.ProjectStatus;
import com.rihab.portfolio.entity.Technology;
import com.rihab.portfolio.exception.BadRequestException;
import com.rihab.portfolio.exception.ConflictException;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.ProjectRepository;
import com.rihab.portfolio.repository.TechnologyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProjectServiceTest {

    private ProjectRepository projectRepository;
    private TechnologyRepository technologyRepository;
    private ProjectService service;

    @BeforeEach
    void setUp() {
        projectRepository = mock(ProjectRepository.class);
        technologyRepository = mock(TechnologyRepository.class);
        service = new ProjectService(projectRepository, technologyRepository);
    }

    private static Project project(String slug, int order) {
        Project p = new Project();
        p.setId(UUID.randomUUID());
        p.setSlug(slug);
        p.setTitle("Title " + slug);
        p.setSummary("Summary");
        p.setPublished(true);
        p.setDisplayOrder(order);
        p.setStatus(ProjectStatus.CURRENT);
        p.getTechnologies().add(new Technology("Spring Boot"));
        return p;
    }

    private static ProjectRequest request(String slug, List<String> technologies) {
        return new ProjectRequest(slug, "New project", null, "A summary", null, null, null, null, null,
                List.of(), List.of("Feature"), List.of(), List.of(), List.of(), List.of(), List.of(),
                technologies, ProjectStatus.IN_PROGRESS, "", "", null, false, false, null);
    }

    @Test
    void listPublishedMapsTechnologies() {
        when(projectRepository.findAllByPublishedTrueOrderByDisplayOrderAscCreatedAtAsc())
                .thenReturn(List.of(project("a", 1), project("b", 2)));

        List<ProjectSummaryDto> result = service.listPublished();

        assertThat(result).extracting(ProjectSummaryDto::slug).containsExactly("a", "b");
        assertThat(result.get(0).technologies()).containsExactly("Spring Boot");
        assertThat(result.get(0).status()).isEqualTo("CURRENT");
    }

    @Test
    void unknownOrUnpublishedSlugIsNotFound() {
        when(projectRepository.findBySlugAndPublishedTrue("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getPublishedBySlug("missing")).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createRejectsDuplicateSlug() {
        when(projectRepository.existsBySlug("taken")).thenReturn(true);

        assertThatThrownBy(() -> service.create(request("taken", List.of()))).isInstanceOf(ConflictException.class);
        verify(projectRepository, never()).save(any());
    }

    @Test
    void createReusesExistingTechnologiesAndDeduplicates() {
        Technology existing = new Technology("React");
        when(projectRepository.existsBySlug("new-project")).thenReturn(false);
        when(technologyRepository.findByNameIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(technologyRepository.findByNameIgnoreCase("react")).thenReturn(Optional.of(existing));
        when(technologyRepository.save(any(Technology.class))).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        ProjectDetailDto dto = service.create(request("new-project", List.of("react", "Docker", " docker ")));

        assertThat(dto.technologies()).containsExactly("React", "Docker");
        assertThat(dto.githubUrl()).isNull();
        assertThat(dto.status()).isEqualTo("IN_PROGRESS");
    }

    @Test
    void reorderRequiresEveryProjectExactlyOnce() {
        Project a = project("a", 1);
        Project b = project("b", 2);
        when(projectRepository.findAll()).thenReturn(List.of(a, b));

        assertThatThrownBy(() -> service.reorder(List.of(a.getId()))).isInstanceOf(BadRequestException.class);
        assertThatThrownBy(() -> service.reorder(List.of(a.getId(), a.getId()))).isInstanceOf(BadRequestException.class);
    }

    @Test
    void reorderAssignsSequentialOrder() {
        Project a = project("a", 1);
        Project b = project("b", 2);
        when(projectRepository.findAll()).thenReturn(List.of(a, b));
        when(projectRepository.findAllByOrderByDisplayOrderAscCreatedAtAsc()).thenReturn(List.of(b, a));

        service.reorder(List.of(b.getId(), a.getId()));

        assertThat(b.getDisplayOrder()).isEqualTo(1);
        assertThat(a.getDisplayOrder()).isEqualTo(2);
    }
}
