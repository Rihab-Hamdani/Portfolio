package com.rihab.portfolio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rihab.portfolio.config.RateLimitProperties;
import com.rihab.portfolio.dto.AnalyticsEventRequest;
import com.rihab.portfolio.dto.AnalyticsSummaryDto;
import com.rihab.portfolio.entity.AnalyticsEvent;
import com.rihab.portfolio.entity.Project;
import com.rihab.portfolio.exception.BadRequestException;
import com.rihab.portfolio.repository.AnalyticsEventRepository;
import com.rihab.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final int MAX_METADATA_JSON_LENGTH = 1000;

    private final AnalyticsEventRepository repository;
    private final ProjectRepository projectRepository;
    private final RateLimiter rateLimiter;
    private final RateLimitProperties rateLimitProperties;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    @Transactional
    public void record(AnalyticsEventRequest request, String clientIp) {
        rateLimiter.check("analytics", clientIp, rateLimitProperties.analyticsPerMinute(), Duration.ofMinutes(1));

        AnalyticsEvent event = new AnalyticsEvent();
        event.setEventType(request.eventType());
        event.setPage(normalizePage(request.page()));
        if (StringUtils.hasText(request.projectSlug())) {
            projectRepository.findBySlug(request.projectSlug().trim())
                    .map(Project::getId)
                    .ifPresent(event::setProjectId);
        }
        event.setMetadata(validateMetadata(request.metadata()));
        repository.save(event);
    }

    @Transactional(readOnly = true)
    public AnalyticsSummaryDto summary(int days) {
        int safeDays = Math.min(Math.max(days, 1), 365);
        Instant since = clock.instant().minus(Duration.ofDays(safeDays));
        return new AnalyticsSummaryDto(
                safeDays,
                repository.countByOccurredAtGreaterThanEqual(since),
                repository.countByType(since).stream()
                        .map(r -> new AnalyticsSummaryDto.TypeCount(r.getType(), r.getTotal())).toList(),
                repository.countPerDay(since).stream()
                        .map(r -> new AnalyticsSummaryDto.DailyCount(r.getDay(), r.getPageViews(), r.getEvents())).toList(),
                repository.topProjects(since).stream()
                        .map(r -> new AnalyticsSummaryDto.ProjectCount(r.getSlug(), r.getTitle(), r.getTotal())).toList(),
                repository.topPages(since).stream()
                        .map(r -> new AnalyticsSummaryDto.PageCount(r.getPage(), r.getTotal())).toList());
    }

    /** Keeps only the path (no query string, which could contain personal data). */
    private String normalizePage(String page) {
        if (!StringUtils.hasText(page)) {
            return null;
        }
        String path = page.trim();
        int query = path.indexOf('?');
        if (query >= 0) {
            path = path.substring(0, query);
        }
        int hash = path.indexOf('#');
        if (hash >= 0) {
            path = path.substring(0, hash);
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return path.length() > 255 ? path.substring(0, 255) : path;
    }

    private Map<String, Object> validateMetadata(Map<String, Object> metadata) {
        if (metadata == null || metadata.isEmpty()) {
            return null;
        }
        Map<String, Object> copy = new LinkedHashMap<>(metadata);
        try {
            if (objectMapper.writeValueAsString(copy).length() > MAX_METADATA_JSON_LENGTH) {
                throw new BadRequestException("Metadata is too large.");
            }
        } catch (JsonProcessingException ex) {
            throw new BadRequestException("Metadata is not valid JSON.");
        }
        return copy;
    }
}
