package com.rihab.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Public URL of the frontend, used to build absolute links in the sitemap. */
@ConfigurationProperties(prefix = "app.site")
public record SiteProperties(String url) {
}
