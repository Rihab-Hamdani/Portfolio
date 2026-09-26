package com.rihab.portfolio.repository;

import com.rihab.portfolio.entity.Technology;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TechnologyRepository extends JpaRepository<Technology, UUID> {

    Optional<Technology> findByNameIgnoreCase(String name);
}
