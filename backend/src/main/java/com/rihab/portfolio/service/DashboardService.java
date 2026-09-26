package com.rihab.portfolio.service;

import com.rihab.portfolio.dto.DashboardOverviewDto;
import com.rihab.portfolio.entity.MessageStatus;
import com.rihab.portfolio.repository.AnalyticsEventRepository;
import com.rihab.portfolio.repository.ContactMessageRepository;
import com.rihab.portfolio.repository.ExperienceRepository;
import com.rihab.portfolio.repository.LeadershipRoleRepository;
import com.rihab.portfolio.repository.ProjectRepository;
import com.rihab.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final LeadershipRoleRepository leadershipRoleRepository;
    private final SkillRepository skillRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final AnalyticsEventRepository analyticsEventRepository;
    private final Clock clock;

    @Transactional(readOnly = true)
    public DashboardOverviewDto overview() {
        return new DashboardOverviewDto(
                projectRepository.count(),
                projectRepository.countByPublishedTrue(),
                experienceRepository.count(),
                leadershipRoleRepository.count(),
                skillRepository.count(),
                contactMessageRepository.count(),
                contactMessageRepository.countByStatus(MessageStatus.NEW),
                analyticsEventRepository.countByOccurredAtGreaterThanEqual(clock.instant().minus(Duration.ofDays(30))));
    }
}
