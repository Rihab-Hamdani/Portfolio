package com.rihab.portfolio.service;

import com.rihab.portfolio.dto.SkillDto;
import com.rihab.portfolio.dto.SkillRequest;
import com.rihab.portfolio.entity.Skill;
import com.rihab.portfolio.exception.ConflictException;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.rihab.portfolio.util.InputSanitizer.blankToNull;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository repository;

    @Transactional(readOnly = true)
    public List<SkillDto> list() {
        return repository.findAllByOrderByCategoryAscDisplayOrderAscNameAsc().stream().map(SkillDto::from).toList();
    }

    @Transactional
    public SkillDto create(SkillRequest request) {
        if (repository.existsByNameIgnoreCaseAndCategory(request.name().trim(), request.category())) {
            throw new ConflictException("This skill already exists in that category.");
        }
        Skill skill = new Skill();
        apply(skill, request);
        return SkillDto.from(repository.save(skill));
    }

    @Transactional
    public SkillDto update(UUID id, SkillRequest request) {
        Skill skill = find(id);
        if (repository.existsByNameIgnoreCaseAndCategoryAndIdNot(request.name().trim(), request.category(), id)) {
            throw new ConflictException("This skill already exists in that category.");
        }
        apply(skill, request);
        return SkillDto.from(repository.save(skill));
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Skill find(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Skill not found."));
    }

    private void apply(Skill skill, SkillRequest r) {
        skill.setName(r.name().trim());
        skill.setCategory(r.category());
        skill.setDescription(blankToNull(r.description()));
        skill.setIcon(blankToNull(r.icon()));
        skill.setDisplayOrder(r.displayOrder() == null ? 0 : r.displayOrder());
    }
}
