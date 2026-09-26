package com.rihab.portfolio.controller.admin;

import com.rihab.portfolio.dto.AnalyticsSummaryDto;
import com.rihab.portfolio.dto.DashboardOverviewDto;
import com.rihab.portfolio.service.AnalyticsService;
import com.rihab.portfolio.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;
    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public DashboardOverviewDto overview() {
        return dashboardService.overview();
    }

    @GetMapping("/analytics/summary")
    public AnalyticsSummaryDto analytics(@RequestParam(defaultValue = "30") int days) {
        return analyticsService.summary(days);
    }
}
