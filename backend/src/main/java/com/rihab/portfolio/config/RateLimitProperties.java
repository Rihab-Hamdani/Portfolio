package com.rihab.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "app.rate-limit")
public record RateLimitProperties(
        @DefaultValue("5") int contactPerHour,
        @DefaultValue("10") int loginPerWindow,
        @DefaultValue("60") int analyticsPerMinute,
        @DefaultValue("false") boolean trustForwardedHeaders) {
}
