package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.LeadershipRole;

import java.util.List;
import java.util.UUID;

public record LeadershipDto(
        UUID id,
        String organization,
        String role,
        String periodLabel,
        String summary,
        List<String> organizational,
        List<String> technical,
        int displayOrder) {

    public static LeadershipDto from(LeadershipRole r) {
        return new LeadershipDto(r.getId(), r.getOrganization(), r.getRole(), r.getPeriodLabel(), r.getSummary(),
                List.copyOf(r.getOrganizational()), List.copyOf(r.getTechnical()), r.getDisplayOrder());
    }
}
