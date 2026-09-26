package com.rihab.portfolio.controller;

import com.rihab.portfolio.TestUsers;
import com.rihab.portfolio.controller.admin.AdminDashboardController;
import com.rihab.portfolio.controller.admin.AdminMessageController;
import com.rihab.portfolio.controller.admin.AdminProjectController;
import com.rihab.portfolio.dto.LoginResponse;
import com.rihab.portfolio.dto.UserDto;
import com.rihab.portfolio.entity.User;
import com.rihab.portfolio.exception.InvalidCredentialsException;
import com.rihab.portfolio.repository.UserRepository;
import com.rihab.portfolio.security.JwtService;
import com.rihab.portfolio.service.AnalyticsService;
import com.rihab.portfolio.service.AuthService;
import com.rihab.portfolio.service.ContactService;
import com.rihab.portfolio.service.DashboardService;
import com.rihab.portfolio.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AuthController.class, AdminProjectController.class, AdminMessageController.class,
        AdminDashboardController.class})
@Import(WebLayerTestConfig.class)
@ActiveProfiles("test")
class AuthAndAdminSecurityTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private AuthService authService;
    @MockitoBean
    private ProjectService projectService;
    @MockitoBean
    private ContactService contactService;
    @MockitoBean
    private DashboardService dashboardService;
    @MockitoBean
    private AnalyticsService analyticsService;
    @MockitoBean
    private UserRepository userRepository;

    private User admin;
    private String token;

    @BeforeEach
    void setUp() {
        admin = TestUsers.admin("hash");
        token = jwtService.issue(admin).token();
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));
        when(projectService.listAll()).thenReturn(List.of());
    }

    // ---------- Login ----------

    @Test
    void loginReturnsJwt() throws Exception {
        when(authService.login(any(), anyString())).thenReturn(new LoginResponse("jwt-token", Instant.now(),
                new UserDto(admin.getId(), admin.getEmail(), admin.getDisplayName(), "ADMIN")));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@test.local\",\"password\":\"secret-password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    void loginWithBadCredentialsReturns401() throws Exception {
        when(authService.login(any(), anyString())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@test.local\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    void loginValidatesPayload() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    void meRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }

    // ---------- Admin authorization ----------

    @Test
    void adminEndpointsRejectAnonymousRequests() throws Exception {
        mockMvc.perform(get("/api/admin/projects"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
        mockMvc.perform(get("/api/admin/messages")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/admin/analytics/summary")).andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/api/admin/projects/{id}", admin.getId())).andExpect(status().isUnauthorized());

        verify(projectService, never()).listAll();
        verify(projectService, never()).delete(any());
    }

    @Test
    void adminEndpointsRejectInvalidTokens() throws Exception {
        mockMvc.perform(get("/api/admin/projects").header(HttpHeaders.AUTHORIZATION, "Bearer invalid.token.value"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/admin/projects").header(HttpHeaders.AUTHORIZATION, "Basic abc"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointsAcceptValidAdminToken() throws Exception {
        mockMvc.perform(get("/api/admin/projects").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void disabledOrDeletedUserLosesAccessImmediately() throws Exception {
        admin.setEnabled(false);
        mockMvc.perform(get("/api/admin/projects").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isUnauthorized());

        when(userRepository.findById(admin.getId())).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/admin/projects").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void corsPreflightIsAllowedOnlyForConfiguredOrigins() throws Exception {
        mockMvc.perform(options("/api/projects")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));

        mockMvc.perform(options("/api/projects")
                        .header(HttpHeaders.ORIGIN, "https://evil.example")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden());
    }
}
