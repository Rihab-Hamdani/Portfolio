package com.rihab.portfolio.repository;

import com.rihab.portfolio.entity.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @EntityGraph(attributePaths = "technologies")
    List<Project> findAllByPublishedTrueOrderByDisplayOrderAscCreatedAtAsc();

    @EntityGraph(attributePaths = "technologies")
    List<Project> findAllByOrderByDisplayOrderAscCreatedAtAsc();

    @EntityGraph(attributePaths = "technologies")
    Optional<Project> findBySlugAndPublishedTrue(String slug);

    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    long countByPublishedTrue();
}
