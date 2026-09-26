package com.rihab.portfolio.repository;

import com.rihab.portfolio.entity.LeadershipRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LeadershipRoleRepository extends JpaRepository<LeadershipRole, UUID> {

    List<LeadershipRole> findAllByOrderByDisplayOrderAscCreatedAtAsc();
}
