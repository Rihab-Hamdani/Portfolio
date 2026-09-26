package com.rihab.portfolio.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end test against a real PostgreSQL (Testcontainers): Flyway migrations, seed content,
 * admin bootstrap, JWT login, admin authorization, contact storage and analytics.
 * Skipped automatically when Docker is not available.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers(disabledWithoutDocker = true)
class PortfolioIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    private String login() throws Exception {
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@test.local\",\"password\":\"test-admin-password-123\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("token").asText();
    }

    @Test
    void migrationsSeedPublishedProjectsAndHideDrafts() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("medical-cabinet-stock-management"))
                .andExpect(jsonPath("$[*].slug").value(hasItem("studymate-ai")))
                .andExpect(jsonPath("$[*].slug").value(not(hasItem("smartcabinet"))));

        mockMvc.perform(get("/api/projects/medical-cabinet-stock-management"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.technologies").value(hasItem("Angular 18")))
                .andExpect(jsonPath("$.architectureSteps[0]").value("Angular PWA|Installable, mobile-first client"));

        mockMvc.perform(get("/api/projects/smartcabinet")).andExpect(status().isNotFound());
        mockMvc.perform(get("/api/skills")).andExpect(status().isOk());
        mockMvc.perform(get("/api/experience")).andExpect(jsonPath("$[0].organization").value("MajraDeep"));
        mockMvc.perform(get("/api/leadership")).andExpect(jsonPath("$[0].role").value("General Secretary"));

        String sitemap = mockMvc.perform(get("/sitemap.xml"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertThat(sitemap).contains("/projects/hezly").doesNotContain("smartcabinet");
    }

    @Test
    void contactMessageIsStoredAndVisibleToAdminOnly() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Integration Tester","email":"tester@example.com","subject":"Hello",
                                 "message":"This message comes from the integration test."}
                                """))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/admin/messages")).andExpect(status().isUnauthorized());

        String token = login();
        mockMvc.perform(get("/api/admin/messages").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[*].email").value(hasItem("tester@example.com")));
    }

    @Test
    void adminCanEditProjectsAndAnalyticsReflectsRealEvents() throws Exception {
        String token = login();

        String projects = mockMvc.perform(get("/api/admin/projects").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode first = objectMapper.readTree(projects).get(0);
        assertThat(first.get("slug").asText()).isEqualTo("medical-cabinet-stock-management");

        // Update: re-order technologies to exercise the ordered join table
        String update = """
                {"slug":"medical-cabinet-stock-management","title":"Medical Cabinet Stock Management PWA",
                 "summary":"Updated summary","technologies":["Spring Boot","Angular 18","New Tech"],
                 "status":"CURRENT","featured":true,"published":true,"displayOrder":1}
                """;
        mockMvc.perform(put("/api/admin/projects/{id}", first.get("id").asText())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(update))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.technologies[0]").value("Spring Boot"))
                .andExpect(jsonPath("$.technologies[2]").value("New Tech"));

        mockMvc.perform(post("/api/analytics/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"eventType\":\"project_view\",\"page\":\"/projects/hezly?utm=x\",\"projectSlug\":\"hezly\"}"))
                .andExpect(status().isAccepted());

        mockMvc.perform(get("/api/admin/analytics/summary").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topProjects[0].slug").value("hezly"));
    }
}
