package com.rihab.portfolio.controller;

import com.rihab.portfolio.config.SiteProperties;
import com.rihab.portfolio.dto.ProjectSummaryDto;
import com.rihab.portfolio.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.time.Duration;

/** Dynamic sitemap generated from published projects, so it never goes stale. */
@RestController
@RequiredArgsConstructor
public class SitemapController {

    private final ProjectService projectService;
    private final SiteProperties siteProperties;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap(HttpServletRequest request) {
        String base = StringUtils.hasText(siteProperties.url())
                ? siteProperties.url().replaceAll("/+$", "")
                : request.getScheme() + "://" + request.getServerName()
                        + (request.getServerPort() == 80 || request.getServerPort() == 443 ? "" : ":" + request.getServerPort());

        StringBuilder xml = new StringBuilder()
                .append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
                .append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n")
                .append(url(base + "/"));
        for (ProjectSummaryDto project : projectService.listPublished()) {
            xml.append(url(base + "/projects/" + project.slug()));
        }
        xml.append("</urlset>\n");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic())
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.toString());
    }

    private static String url(String loc) {
        return "  <url><loc>" + HtmlUtils.htmlEscape(loc) + "</loc></url>\n";
    }
}
