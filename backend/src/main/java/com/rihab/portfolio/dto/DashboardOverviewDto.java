package com.rihab.portfolio.dto;

public record DashboardOverviewDto(
        long projects,
        long publishedProjects,
        long experiences,
        long leadershipRoles,
        long skills,
        long messages,
        long unreadMessages,
        long eventsLast30Days) {
}
