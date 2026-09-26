package com.rihab.portfolio.service;

import com.rihab.portfolio.exception.RateLimitExceededException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory fixed-window rate limiter keyed by bucket + client key.
 * Good enough for a single-instance portfolio; for several instances use a shared store (e.g. Redis).
 */
@Component
public class RateLimiter {

    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private final Clock clock;

    public RateLimiter(Clock clock) {
        this.clock = clock;
    }

    public void check(String bucket, String key, int limit, Duration period) {
        if (limit <= 0) {
            return;
        }
        long now = clock.millis();
        long periodMillis = period.toMillis();
        String mapKey = bucket + ':' + key;
        Window window = windows.compute(mapKey, (k, existing) -> {
            if (existing == null || now >= existing.resetAt()) {
                return new Window(now + periodMillis, 1);
            }
            return new Window(existing.resetAt(), existing.count() + 1);
        });
        if (window.count() > limit) {
            long retryAfter = Math.max(1, (window.resetAt() - now + 999) / 1000);
            throw new RateLimitExceededException(retryAfter);
        }
    }

    /** Removes expired windows so memory does not grow unbounded. */
    @Scheduled(fixedDelay = 300_000)
    public void evictExpired() {
        long now = clock.millis();
        windows.entrySet().removeIf(e -> now >= e.getValue().resetAt());
    }

    int size() {
        return windows.size();
    }

    private record Window(long resetAt, int count) {
    }
}
