package com.rihab.portfolio.service;

import com.rihab.portfolio.config.RateLimitProperties;
import com.rihab.portfolio.dto.LoginRequest;
import com.rihab.portfolio.dto.LoginResponse;
import com.rihab.portfolio.dto.UserDto;
import com.rihab.portfolio.entity.User;
import com.rihab.portfolio.exception.InvalidCredentialsException;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.UserRepository;
import com.rihab.portfolio.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    /** Used when the email is unknown so the response time does not reveal whether an account exists. */
    private final String dummyHash;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RateLimiter rateLimiter;
    private final RateLimitProperties rateLimitProperties;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       RateLimiter rateLimiter, RateLimitProperties rateLimitProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.rateLimiter = rateLimiter;
        this.rateLimitProperties = rateLimitProperties;
        this.dummyHash = passwordEncoder.encode("dummy-password-for-timing-" + UUID.randomUUID());
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request, String clientIp) {
        rateLimiter.check("login", clientIp, rateLimitProperties.loginPerWindow(), Duration.ofMinutes(15));

        String email = request.email().trim().toLowerCase(Locale.ROOT);
        Optional<User> user = userRepository.findByEmailIgnoreCase(email);
        String hash = user.map(User::getPasswordHash).orElse(dummyHash);
        boolean matches = passwordEncoder.matches(request.password(), hash);

        if (user.isEmpty() || !matches || !user.get().isEnabled()) {
            throw new InvalidCredentialsException();
        }
        JwtService.IssuedToken token = jwtService.issue(user.get());
        return new LoginResponse(token.token(), token.expiresAt(), UserDto.from(user.get()));
    }

    @Transactional(readOnly = true)
    public UserDto currentUser(UUID userId) {
        return userRepository.findById(userId)
                .map(UserDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
