package com.rihab.portfolio.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({
        JwtProperties.class,
        CorsProperties.class,
        AdminProperties.class,
        RateLimitProperties.class,
        NotificationProperties.class,
        SiteProperties.class
})
public class PropertiesConfig {
}
