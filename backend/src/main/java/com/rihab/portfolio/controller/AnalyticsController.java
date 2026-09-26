package com.rihab.portfolio.controller;

import com.rihab.portfolio.dto.AnalyticsEventRequest;
import com.rihab.portfolio.service.AnalyticsService;
import com.rihab.portfolio.util.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ClientIpResolver clientIpResolver;

    @PostMapping("/events")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void record(@Valid @RequestBody AnalyticsEventRequest request, HttpServletRequest httpRequest) {
        analyticsService.record(request, clientIpResolver.resolve(httpRequest));
    }
}
