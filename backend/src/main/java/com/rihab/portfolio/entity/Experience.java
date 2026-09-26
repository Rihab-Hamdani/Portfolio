package com.rihab.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "experiences")
public class Experience extends AuditableEntity {

    @Column(nullable = false, length = 160)
    private String organization;

    @Column(nullable = false, length = 160)
    private String role;

    @Column(name = "employment_type", length = 60)
    private String employmentType;

    @Column(name = "period_label", length = 80)
    private String periodLabel;

    @Column(length = 120)
    private String location;

    @Column(columnDefinition = "text")
    private String summary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> responsibilities = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> technologies = new ArrayList<>();

    @Column(name = "project_slug", length = 120)
    private String projectSlug;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
