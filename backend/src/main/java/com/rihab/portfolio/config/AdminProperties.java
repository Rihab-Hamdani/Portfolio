package com.rihab.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "app.admin")
public record AdminProperties(String email, String password, @DefaultValue("Admin") String displayName) {
}
