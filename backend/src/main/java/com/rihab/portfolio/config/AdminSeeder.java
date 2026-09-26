package com.rihab.portfolio.config;

import com.rihab.portfolio.entity.Role;
import com.rihab.portfolio.entity.User;
import com.rihab.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Locale;

/**
 * Creates the first admin account from ADMIN_EMAIL / ADMIN_PASSWORD on startup.
 * Only runs when the account does not exist yet; credentials are never stored in migrations.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

    static final int MIN_PASSWORD_LENGTH = 12;

    private final AdminProperties adminProperties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String email = adminProperties.email();
        String password = adminProperties.password();

        if (!StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            if (userRepository.count() == 0) {
                log.warn("No admin account exists. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one on startup.");
            }
            return;
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            log.warn("ADMIN_PASSWORD must be at least {} characters. Admin account was not created.", MIN_PASSWORD_LENGTH);
            return;
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            return;
        }

        User admin = new User();
        admin.setEmail(normalizedEmail);
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setDisplayName(StringUtils.hasText(adminProperties.displayName()) ? adminProperties.displayName() : "Admin");
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);
        userRepository.save(admin);
        log.info("Admin account created for {}", normalizedEmail);
    }
}
