package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.Skill;

import java.util.UUID;

public record SkillDto(UUID id, String name, String category, String description, String icon, int displayOrder) {

    public static SkillDto from(Skill s) {
        return new SkillDto(s.getId(), s.getName(), s.getCategory().name(), s.getDescription(), s.getIcon(),
                s.getDisplayOrder());
    }
}
