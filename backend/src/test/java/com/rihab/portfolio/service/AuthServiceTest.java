package com.rihab.portfolio.service;

import com.rihab.portfolio.TestUsers;
import com.rihab.portfolio.config.JwtProperties;
import com.rihab.portfolio.config.RateLimitProperties;
import com.rihab.portfolio.dto.LoginRequest;
import com.rihab.portfolio.dto.LoginResponse;
import com.rihab.portfolio.entity.User;
import com.rihab.portfolio.exception.InvalidCredentialsException;
import com.rihab.portfolio.repository.UserRepository;
import com.rihab.portfolio.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Clock;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private static final String PASSWORD = "correct-horse-battery";

    private final PasswordEncoder encoder = new BCryptPasswordEncoder(4); // fast for tests
    private UserRepository userRepository;
    private JwtService jwtService;
    private AuthService authService;
    private User admin;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtService = new JwtService(new JwtProperties("auth-service-test-secret-long-enough-0123456789", 60, "t"),
                Clock.systemUTC());
        authService = new AuthService(userRepository, encoder, jwtService, new RateLimiter(Clock.systemUTC()),
                new RateLimitProperties(5, 3, 60, false));
        admin = TestUsers.admin(encoder.encode(PASSWORD));
        when(userRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("admin@test.local")).thenReturn(Optional.of(admin));
    }

    @Test
    void validCredentialsReturnVerifiableToken() {
        LoginResponse response = authService.login(new LoginRequest("Admin@Test.local ", PASSWORD), "1.1.1.1");

        assertThat(response.token()).isNotBlank();
        assertThat(jwtService.validate(response.token())).contains(admin.getId());
        assertThat(response.user().email()).isEqualTo("admin@test.local");
        assertThat(response.user().role()).isEqualTo("ADMIN");
    }

    @Test
    void wrongPasswordIsRejected() {
        assertThatThrownBy(() -> authService.login(new LoginRequest("admin@test.local", "wrong-password"), "1.1.1.2"))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void unknownEmailIsRejectedWithSameError() {
        assertThatThrownBy(() -> authService.login(new LoginRequest("nobody@test.local", PASSWORD), "1.1.1.3"))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid email or password.");
    }

    @Test
    void disabledAccountIsRejected() {
        admin.setEnabled(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("admin@test.local", PASSWORD), "1.1.1.4"))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void bruteForceIsRateLimited() {
        for (int i = 0; i < 3; i++) {
            assertThatThrownBy(() -> authService.login(new LoginRequest("admin@test.local", "nope-nope"), "9.9.9.9"))
                    .isInstanceOf(InvalidCredentialsException.class);
        }
        assertThatThrownBy(() -> authService.login(new LoginRequest("admin@test.local", PASSWORD), "9.9.9.9"))
                .isInstanceOf(com.rihab.portfolio.exception.RateLimitExceededException.class);
    }
}
