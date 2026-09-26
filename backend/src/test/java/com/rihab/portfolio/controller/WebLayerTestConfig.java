package com.rihab.portfolio.controller;

import com.rihab.portfolio.config.ClockConfig;
import com.rihab.portfolio.config.PasswordConfig;
import com.rihab.portfolio.config.PropertiesConfig;
import com.rihab.portfolio.security.JsonErrorWriter;
import com.rihab.portfolio.security.JwtService;
import com.rihab.portfolio.security.SecurityConfig;
import com.rihab.portfolio.util.ClientIpResolver;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;

/** Real security configuration for @WebMvcTest slices, so authorization rules are actually exercised. */
@TestConfiguration
@Import({
        PropertiesConfig.class,
        ClockConfig.class,
        PasswordConfig.class,
        SecurityConfig.class,
        JwtService.class,
        JsonErrorWriter.class,
        ClientIpResolver.class
})
public class WebLayerTestConfig {
}
