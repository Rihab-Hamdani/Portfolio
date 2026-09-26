package com.rihab.portfolio.repository;

import com.rihab.portfolio.entity.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, UUID> {

    interface TypeCount {
        String getType();

        Long getTotal();
    }

    interface DailyCount {
        String getDay();

        Long getPageViews();

        Long getEvents();
    }

    interface ProjectCount {
        String getSlug();

        String getTitle();

        Long getTotal();
    }

    interface PageCount {
        String getPage();

        Long getTotal();
    }

    long countByOccurredAtGreaterThanEqual(Instant since);

    @Query(value = """
            SELECT event_type AS type, COUNT(*) AS total
            FROM analytics_events
            WHERE occurred_at >= :since
            GROUP BY event_type
            ORDER BY total DESC
            """, nativeQuery = true)
    List<TypeCount> countByType(@Param("since") Instant since);

    @Query(value = """
            SELECT to_char(date_trunc('day', occurred_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day,
                   COUNT(*) FILTER (WHERE event_type = 'page_view') AS "pageViews",
                   COUNT(*) AS events
            FROM analytics_events
            WHERE occurred_at >= :since
            GROUP BY 1
            ORDER BY 1
            """, nativeQuery = true)
    List<DailyCount> countPerDay(@Param("since") Instant since);

    @Query(value = """
            SELECT p.slug AS slug, p.title AS title, COUNT(*) AS total
            FROM analytics_events e
            JOIN projects p ON p.id = e.project_id
            WHERE e.event_type = 'project_view' AND e.occurred_at >= :since
            GROUP BY p.slug, p.title
            ORDER BY total DESC
            LIMIT 10
            """, nativeQuery = true)
    List<ProjectCount> topProjects(@Param("since") Instant since);

    @Query(value = """
            SELECT page AS page, COUNT(*) AS total
            FROM analytics_events
            WHERE event_type = 'page_view' AND page IS NOT NULL AND occurred_at >= :since
            GROUP BY page
            ORDER BY total DESC
            LIMIT 10
            """, nativeQuery = true)
    List<PageCount> topPages(@Param("since") Instant since);
}
