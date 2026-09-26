package com.rihab.portfolio.dto;

import java.util.List;

/** Aggregated analytics built only from stored events. Empty lists mean "no data yet". */
public record AnalyticsSummaryDto(
        int days,
        long totalEvents,
        List<TypeCount> byType,
        List<DailyCount> daily,
        List<ProjectCount> topProjects,
        List<PageCount> topPages) {

    public record TypeCount(String type, long total) {
    }

    public record DailyCount(String day, long pageViews, long events) {
    }

    public record ProjectCount(String slug, String title, long total) {
    }

    public record PageCount(String page, long total) {
    }
}
