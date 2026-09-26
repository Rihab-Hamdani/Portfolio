package com.rihab.portfolio.repository;

import com.rihab.portfolio.entity.Skill;
import com.rihab.portfolio.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

    List<Skill> findAllByOrderByCategoryAscDisplayOrderAscNameAsc();

    boolean existsByNameIgnoreCaseAndCategory(String name, SkillCategory category);

    boolean existsByNameIgnoreCaseAndCategoryAndIdNot(String name, SkillCategory category, UUID id);
}
