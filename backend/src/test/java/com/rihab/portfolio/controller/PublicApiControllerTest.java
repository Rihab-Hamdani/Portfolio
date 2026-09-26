package com.rihab.portfolio.controller;

import com.rihab.portfolio.dto.ProjectDetailDto;
import com.rihab.portfolio.dto.ProjectSummaryDto;
import com.rihab.portfolio.exception.RateLimitExceededException;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.UserRepository;
import com.rihab.portfolio.service.AnalyticsService;
import com.rihab.portfolio.service.ContactService;
import com.rihab.portfolio.service.ExperienceService;
import com.rihab.portfolio.service.LeadershipService;
import com.rihab.portfolio.service.ProjectService;
import com.rihab.portfolio.service.SkillService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {ProjectController.class, ContactController.class, ContentController.class,
        AnalyticsController.class})
@Import(WebLayerTestConfig.class)
@ActiveProfiles("test")
class PublicApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProjectService projectService;
    @MockitoBean
    private ContactService contactService;
    @MockitoBean
    private ExperienceService experienceService;
    @MockitoBean
    private LeadershipService leadershipService;
    @MockitoBean
    private SkillService skillService;
    @MockitoBean
    private AnalyticsService analyticsService;
    @MockitoBean
    private UserRepository userRepository;

    // ---------- Projects ----------

    @Test
    void listsPublishedProjectsWithoutAuthentication() throws Exception {
        when(projectService.listPublished()).thenReturn(List.of(new ProjectSummaryDto(UUID.randomUUID(),
                "studymate-ai", "StudyMate AI", "tagline", "summary", null, List.of("React", "FastAPI"),
                null, null, null, true, 2)));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].slug").value("studymate-ai"))
                .andExpect(jsonPath("$[0].technologies[1]").value("FastAPI"))
                // null fields are omitted rather than serialised as null
                .andExpect(jsonPath("$[0].status").doesNotExist())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"));
    }

    @Test
    void returnsProjectCaseStudyBySlug() throws Exception {
        when(projectService.getPublishedBySlug("hezly")).thenReturn(new ProjectDetailDto(UUID.randomUUID(), "hezly",
                "Hezly", null, "summary", null, null, null, "Frontend intern", null, List.of("Angular 18|My contribution"),
                List.of(), List.of("Frontend"), List.of(), List.of(), List.of(), List.of(), "INTERNSHIP",
                List.of("Angular 18"), null, null, null, true, true, 3, Instant.now()));

        mockMvc.perform(get("/api/projects/hezly"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INTERNSHIP"))
                .andExpect(jsonPath("$.contribution[0]").value("Frontend"));
    }

    @Test
    void unknownProjectReturnsStructured404() throws Exception {
        when(projectService.getPublishedBySlug("nope")).thenThrow(new ResourceNotFoundException("Project not found."));

        mockMvc.perform(get("/api/projects/nope"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Project not found."))
                .andExpect(jsonPath("$.path").value("/api/projects/nope"))
                .andExpect(jsonPath("$.trace").doesNotExist());
    }

    @Test
    void unexpectedErrorsDoNotLeakDetails() throws Exception {
        when(projectService.listPublished()).thenThrow(new IllegalStateException("db password is hunter2"));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Something went wrong on our side. Please try again later."));
    }

    @Test
    void publicContentEndpointsAreOpen() throws Exception {
        when(experienceService.list()).thenReturn(List.of());
        when(leadershipService.list()).thenReturn(List.of());
        when(skillService.list()).thenReturn(List.of());

        mockMvc.perform(get("/api/experience")).andExpect(status().isOk());
        mockMvc.perform(get("/api/leadership")).andExpect(status().isOk());
        mockMvc.perform(get("/api/skills")).andExpect(status().isOk());
    }

    // ---------- Contact ----------

    @Test
    void validContactMessageIsAccepted() throws Exception {
        when(contactService.submit(any(), anyString())).thenReturn(true);

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Jane Doe","email":"jane@example.com","subject":"Internship",
                                 "message":"Hello Rihab, I would like to discuss an internship."}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value(ContactController.SUCCESS_MESSAGE));
    }

    @Test
    void invalidContactMessageReturnsFieldErrors() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"J","email":"not-an-email","subject":"","message":"short"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.email").value("Please enter a valid email address."))
                .andExpect(jsonPath("$.fieldErrors.subject").exists())
                .andExpect(jsonPath("$.fieldErrors.message").exists());

        verify(contactService, never()).submit(any(), anyString());
    }

    @Test
    void malformedJsonReturns400() throws Exception {
        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content("{not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("The request is malformed."));
    }

    @Test
    void rateLimitedContactReturns429WithRetryAfter() throws Exception {
        when(contactService.submit(any(), anyString())).thenThrow(new RateLimitExceededException(120));

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Jane Doe","email":"jane@example.com","subject":"Internship",
                                 "message":"Hello Rihab, I would like to discuss an internship."}
                                """))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "120"));
    }

    // ---------- Analytics ----------

    @Test
    void analyticsRejectsUnknownEventTypes() throws Exception {
        mockMvc.perform(post("/api/analytics/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"eventType\":\"fake_visitors\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/analytics/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"eventType\":\"page_view\",\"page\":\"/\"}"))
                .andExpect(status().isAccepted());
    }
}
