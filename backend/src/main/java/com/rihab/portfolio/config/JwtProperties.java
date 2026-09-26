package com.rihab.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        @DefaultValue("120") long expirationMinutes,
        @DefaultValue("rihab-portfolio") String issuer) {
}
