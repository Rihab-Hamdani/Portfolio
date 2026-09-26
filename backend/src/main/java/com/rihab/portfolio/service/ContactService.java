package com.rihab.portfolio.service;

import com.rihab.portfolio.config.RateLimitProperties;
import com.rihab.portfolio.dto.ContactMessageDto;
import com.rihab.portfolio.dto.ContactRequest;
import com.rihab.portfolio.dto.PageResponse;
import com.rihab.portfolio.entity.ContactMessage;
import com.rihab.portfolio.entity.MessageStatus;
import com.rihab.portfolio.exception.BadRequestException;
import com.rihab.portfolio.exception.ResourceNotFoundException;
import com.rihab.portfolio.repository.ContactMessageRepository;
import com.rihab.portfolio.util.InputSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.Locale;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository repository;
    private final RateLimiter rateLimiter;
    private final RateLimitProperties rateLimitProperties;
    private final NotificationService notificationService;

    /**
     * Validates (bean validation already ran), rate-limits, sanitises and stores a contact message.
     *
     * @return true if the message was stored, false if it was silently discarded as spam
     */
    @Transactional
    public boolean submit(ContactRequest request, String clientIp) {
        rateLimiter.check("contact", clientIp, rateLimitProperties.contactPerHour(), Duration.ofHours(1));

        // Honeypot: humans never see this field. Pretend success so bots learn nothing.
        if (StringUtils.hasText(request.website())) {
            log.info("Discarded contact submission that filled the honeypot field.");
            return false;
        }

        String name = InputSanitizer.singleLine(request.name());
        String subject = InputSanitizer.singleLine(request.subject());
        String message = InputSanitizer.multiLine(request.message());
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (name.length() < 2 || subject.length() < 3 || message.length() < 10) {
            throw new BadRequestException("Your message contains invalid content. Please remove any HTML and try again.");
        }

        ContactMessage entity = new ContactMessage();
        entity.setName(name);
        entity.setEmail(email);
        entity.setSubject(subject);
        entity.setMessage(message);
        entity.setStatus(MessageStatus.NEW);
        ContactMessage saved = repository.save(entity);

        notificationService.notifyNewMessage(saved);
        return true;
    }

    @Transactional(readOnly = true)
    public PageResponse<ContactMessageDto> list(MessageStatus status, int page, int size) {
        PageRequest pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100));
        Page<ContactMessage> result = status == null
                ? repository.findAllByOrderByCreatedAtDesc(pageable)
                : repository.findAllByStatusOrderByCreatedAtDesc(status, pageable);
        return PageResponse.from(result, ContactMessageDto::from);
    }

    @Transactional
    public ContactMessageDto updateStatus(UUID id, MessageStatus status) {
        ContactMessage message = find(id);
        message.setStatus(status);
        return ContactMessageDto.from(message);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private ContactMessage find(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Message not found."));
    }
}
