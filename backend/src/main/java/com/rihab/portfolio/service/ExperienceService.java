package com.rihab.portfolio.service;

import com.rihab.portfolio.dto.ExperienceDto;
import com.rihab.portfolio.dto.ExperienceRequest;
import com.rihab.portfolio.entity.Experience;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.rihab.portfolio.util.InputSanitizer.blankToNull;
import static com.rihab.portfolio.util.InputSanitizer.cleanList;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository repository;

    @Transactional(readOnly = true)
    public List<ExperienceDto> list() {
        return repository.findAllByOrderByDisplayOrderAscCreatedAtAsc().stream().map(ExperienceDto::from).toList();
    }

    @Transactional
    public ExperienceDto create(ExperienceRequest request) {
        Experience experience = new Experience();
        apply(experience, request);
        if (request.displayOrder() == null) {
            experience.setDisplayOrder((int) repository.count() + 1);
        }
        return ExperienceDto.from(repository.save(experience));
    }

    @Transactional
    public ExperienceDto update(UUID id, ExperienceRequest request) {
        Experience experience = find(id);
        apply(experience, request);
        return ExperienceDto.from(repository.save(experience));
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Experience find(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Experience not found."));
    }

    private void apply(Experience e, ExperienceRequest r) {
        e.setOrganization(r.organization().trim());
        e.setRole(r.role().trim());
        e.setEmploymentType(blankToNull(r.employmentType()));
        e.setPeriodLabel(blankToNull(r.periodLabel()));
        e.setLocation(blankToNull(r.location()));
        e.setSummary(blankToNull(r.summary()));
        e.setResponsibilities(cleanList(r.responsibilities()));
        e.setTechnologies(cleanList(r.technologies()));
        e.setProjectSlug(blankToNull(r.projectSlug()));
        if (r.displayOrder() != null) {
            e.setDisplayOrder(r.displayOrder());
        }
    }
}
