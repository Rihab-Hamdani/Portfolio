package com.rihab.portfolio.util;

import com.rihab.portfolio.config.RateLimitProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

/**
 * Resolves the client IP used as a rate-limit key. X-Forwarded-For is only trusted when the
 * backend runs behind a reverse proxy you control (TRUST_FORWARDED_HEADERS=true); otherwise a
 * client could spoof it to bypass rate limiting. IPs are never persisted.
 */
@Component
public class ClientIpResolver {

    private final boolean trustForwardedHeaders;

    public ClientIpResolver(RateLimitProperties properties) {
        this.trustForwardedHeaders = properties.trustForwardedHeaders();
    }

    public String resolve(HttpServletRequest request) {
        if (trustForwardedHeaders) {
            String forwarded = request.getHeader("X-Forwarded-For");
            if (forwarded != null && !forwarded.isBlank()) {
                return forwarded.split(",")[0].trim();
            }
            String realIp = request.getHeader("X-Real-IP");
            if (realIp != null && !realIp.isBlank()) {
                return realIp.trim();
            }
        }
        return request.getRemoteAddr();
    }
}
