package com.rihab.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "projects")
public class Project extends AuditableEntity {

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(length = 300)
    private String tagline;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @Column(columnDefinition = "text")
    private String context;

    @Column(columnDefinition = "text")
    private String problem;

    @Column(columnDefinition = "text")
    private String solution;

    @Column(name = "my_role", columnDefinition = "text")
    private String myRole;

    @Column(name = "architecture_description", columnDefinition = "text")
    private String architectureDescription;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "architecture_steps", nullable = false, columnDefinition = "jsonb")
    private List<String> architectureSteps = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> features = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> contribution = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> challenges = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> learnings = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "research_questions", nullable = false, columnDefinition = "jsonb")
    private List<String> researchQuestions = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<Screenshot> screenshots = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ProjectStatus status;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @ManyToMany
    @JoinTable(
            name = "project_technologies",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "technology_id"))
    @OrderColumn(name = "position")
    private List<Technology> technologies = new ArrayList<>();
}
