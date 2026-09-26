package com.rihab.portfolio.security;

import com.rihab.portfolio.TestUsers;
import com.rihab.portfolio.config.JwtProperties;
import com.rihab.portfolio.entity.User;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "unit-test-secret-that-is-definitely-long-enough-123";
    private static final Instant NOW = Instant.parse("2026-01-15T10:00:00Z");

    private JwtService service(Clock clock) {
        return new JwtService(new JwtProperties(SECRET, 60, "test-issuer"), clock);
    }

    @Test
    void issuedTokenIsValidAndCarriesUserId() {
        JwtService jwt = service(Clock.fixed(NOW, ZoneOffset.UTC));
        User user = TestUsers.admin("hash");

        JwtService.IssuedToken token = jwt.issue(user);

        assertThat(token.expiresAt()).isEqualTo(NOW.plus(Duration.ofMinutes(60)));
        assertThat(jwt.validate(token.token())).contains(user.getId());
    }

    @Test
    void expiredTokenIsRejected() {
        User user = TestUsers.admin("hash");
        String token = service(Clock.fixed(NOW, ZoneOffset.UTC)).issue(user).token();

        JwtService later = service(Clock.fixed(NOW.plus(Duration.ofMinutes(61)), ZoneOffset.UTC));

        assertThat(later.validate(token)).isEmpty();
    }

    @Test
    void tamperedTokenIsRejected() {
        JwtService jwt = service(Clock.fixed(NOW, ZoneOffset.UTC));
        String token = jwt.issue(TestUsers.admin("hash")).token();
        String tampered = token.substring(0, token.length() - 2) + (token.endsWith("AA") ? "BB" : "AA");

        assertThat(jwt.validate(tampered)).isEmpty();
        assertThat(jwt.validate("not-a-jwt")).isEmpty();
    }

    @Test
    void tokenSignedWithAnotherSecretIsRejected() {
        Clock clock = Clock.fixed(NOW, ZoneOffset.UTC);
        String foreign = new JwtService(new JwtProperties("another-secret-that-is-also-long-enough-456789", 60, "test-issuer"), clock)
                .issue(TestUsers.admin("hash")).token();

        assertThat(service(clock).validate(foreign)).isEmpty();
    }

    @Test
    void tokenWithWrongIssuerIsRejected() {
        Clock clock = Clock.fixed(NOW, ZoneOffset.UTC);
        String token = new JwtService(new JwtProperties(SECRET, 60, "other-issuer"), clock)
                .issue(TestUsers.admin("hash")).token();

        assertThat(service(clock).validate(token)).isEmpty();
    }

    @Test
    void shortSecretFailsFast() {
        assertThatThrownBy(() -> new JwtService(new JwtProperties("too-short", 60, "x"), Clock.systemUTC()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("JWT_SECRET");
    }
}
