package com.rihab.portfolio.service;

import com.rihab.portfolio.dto.LeadershipDto;
import com.rihab.portfolio.dto.LeadershipRequest;
import com.rihab.portfolio.entity.LeadershipRole;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.LeadershipRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.rihab.portfolio.util.InputSanitizer.blankToNull;
import static com.rihab.portfolio.util.InputSanitizer.cleanList;

@Service
@RequiredArgsConstructor
public class LeadershipService {

    private final LeadershipRoleRepository repository;

    @Transactional(readOnly = true)
    public List<LeadershipDto> list() {
        return repository.findAllByOrderByDisplayOrderAscCreatedAtAsc().stream().map(LeadershipDto::from).toList();
    }

    @Transactional
    public LeadershipDto create(LeadershipRequest request) {
        LeadershipRole role = new LeadershipRole();
        apply(role, request);
        if (request.displayOrder() == null) {
            role.setDisplayOrder((int) repository.count() + 1);
        }
        return LeadershipDto.from(repository.save(role));
    }

    @Transactional
    public LeadershipDto update(UUID id, LeadershipRequest request) {
        LeadershipRole role = find(id);
        apply(role, request);
        return LeadershipDto.from(repository.save(role));
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private LeadershipRole find(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Leadership role not found."));
    }

    private void apply(LeadershipRole role, LeadershipRequest r) {
        role.setOrganization(r.organization().trim());
        role.setRole(r.role().trim());
        role.setPeriodLabel(blankToNull(r.periodLabel()));
        role.setSummary(blankToNull(r.summary()));
        role.setOrganizational(cleanList(r.organizational()));
        role.setTechnical(cleanList(r.technical()));
        if (r.displayOrder() != null) {
            role.setDisplayOrder(r.displayOrder());
        }
    }
}
