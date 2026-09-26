package com.rihab.portfolio.repository;

import com.rihab.portfolio.entity.ContactMessage;
import com.rihab.portfolio.entity.MessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<ContactMessage> findAllByStatusOrderByCreatedAtDesc(MessageStatus status, Pageable pageable);

    long countByStatus(MessageStatus status);
}
