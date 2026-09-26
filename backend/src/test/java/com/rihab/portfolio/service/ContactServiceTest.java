package com.rihab.portfolio.service;

import com.rihab.portfolio.config.RateLimitProperties;
import com.rihab.portfolio.dto.ContactRequest;
import com.rihab.portfolio.entity.ContactMessage;
import com.rihab.portfolio.entity.MessageStatus;
import com.rihab.portfolio.exception.BadRequestException;
import com.rihab.portfolio.exception.RateLimitExceededException;
import com.rihab.portfolio.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Clock;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ContactServiceTest {

    private ContactMessageRepository repository;
    private NotificationService notificationService;
    private ContactService service;

    @BeforeEach
    void setUp() {
        repository = mock(ContactMessageRepository.class);
        notificationService = mock(NotificationService.class);
        when(repository.save(any(ContactMessage.class))).thenAnswer(inv -> inv.getArgument(0));
        service = new ContactService(repository, new RateLimiter(Clock.systemUTC()),
                new RateLimitProperties(2, 10, 60, false), notificationService);
    }

    @Test
    void storesSanitisedMessage() {
        ContactRequest request = new ContactRequest(
                "  Jane <b>Doe</b> ", " Jane@Example.COM ", "Internship   opportunity",
                "Hello Rihab,\r\n<script>alert(1)</script>I would like to talk about an internship.", null);

        boolean stored = service.submit(request, "10.0.0.1");

        assertThat(stored).isTrue();
        ArgumentCaptor<ContactMessage> captor = ArgumentCaptor.forClass(ContactMessage.class);
        verify(repository).save(captor.capture());
        ContactMessage saved = captor.getValue();
        assertThat(saved.getName()).isEqualTo("Jane Doe");
        assertThat(saved.getEmail()).isEqualTo("jane@example.com");
        assertThat(saved.getSubject()).isEqualTo("Internship opportunity");
        assertThat(saved.getMessage()).doesNotContain("<script>").contains("I would like to talk");
        assertThat(saved.getStatus()).isEqualTo(MessageStatus.NEW);
        verify(notificationService).notifyNewMessage(saved);
    }

    @Test
    void honeypotSubmissionIsDiscardedSilently() {
        ContactRequest request = new ContactRequest("Bot", "bot@spam.test", "Buy now", "Cheap offers for everyone!!", "http://spam");

        boolean stored = service.submit(request, "10.0.0.2");

        assertThat(stored).isFalse();
        verify(repository, never()).save(any());
    }

    @Test
    void messageThatIsOnlyMarkupIsRejected() {
        ContactRequest request = new ContactRequest("Jane", "jane@example.com", "Hello there", "<p></p><div></div><span></span>", null);

        assertThatThrownBy(() -> service.submit(request, "10.0.0.3")).isInstanceOf(BadRequestException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void rateLimitIsEnforcedPerClient() {
        ContactRequest request = new ContactRequest("Jane", "jane@example.com", "Hello there", "A perfectly normal message.", null);
        service.submit(request, "10.0.0.4");
        service.submit(request, "10.0.0.4");

        assertThatThrownBy(() -> service.submit(request, "10.0.0.4")).isInstanceOf(RateLimitExceededException.class);
    }
}
