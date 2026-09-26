package com.rihab.portfolio.service;

import com.rihab.portfolio.exception.RateLimitExceededException;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RateLimiterTest {

    /** Minimal mutable clock for tests. */
    static final class MutableClock extends Clock {
        private final AtomicReference<Instant> now;

        MutableClock(Instant start) {
            this.now = new AtomicReference<>(start);
        }

        void advance(Duration d) {
            now.updateAndGet(i -> i.plus(d));
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now.get();
        }
    }

    @Test
    void allowsUpToLimitThenRejects() {
        RateLimiter limiter = new RateLimiter(new MutableClock(Instant.parse("2026-01-01T00:00:00Z")));

        for (int i = 0; i < 3; i++) {
            limiter.check("contact", "1.2.3.4", 3, Duration.ofHours(1));
        }

        assertThatThrownBy(() -> limiter.check("contact", "1.2.3.4", 3, Duration.ofHours(1)))
                .isInstanceOf(RateLimitExceededException.class)
                .satisfies(ex -> assertThat(((RateLimitExceededException) ex).getRetryAfterSeconds()).isPositive());
    }

    @Test
    void keysAndBucketsAreIndependent() {
        RateLimiter limiter = new RateLimiter(new MutableClock(Instant.parse("2026-01-01T00:00:00Z")));
        limiter.check("contact", "a", 1, Duration.ofHours(1));

        assertThatCode(() -> limiter.check("contact", "b", 1, Duration.ofHours(1))).doesNotThrowAnyException();
        assertThatCode(() -> limiter.check("login", "a", 1, Duration.ofHours(1))).doesNotThrowAnyException();
    }

    @Test
    void windowResetsAfterPeriod() {
        MutableClock clock = new MutableClock(Instant.parse("2026-01-01T00:00:00Z"));
        RateLimiter limiter = new RateLimiter(clock);
        limiter.check("login", "ip", 1, Duration.ofMinutes(15));

        clock.advance(Duration.ofMinutes(16));

        assertThatCode(() -> limiter.check("login", "ip", 1, Duration.ofMinutes(15))).doesNotThrowAnyException();
    }

    @Test
    void evictionRemovesExpiredWindows() {
        MutableClock clock = new MutableClock(Instant.parse("2026-01-01T00:00:00Z"));
        RateLimiter limiter = new RateLimiter(clock);
        limiter.check("x", "ip", 5, Duration.ofMinutes(1));
        assertThat(limiter.size()).isEqualTo(1);

        clock.advance(Duration.ofMinutes(2));
        limiter.evictExpired();

        assertThat(limiter.size()).isZero();
    }
}
