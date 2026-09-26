package com.rihab.portfolio.service;

import com.rihab.portfolio.config.NotificationProperties;
import com.rihab.portfolio.entity.ContactMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Optional e-mail notification when a contact message arrives. Disabled unless MAIL_ENABLED=true
 * and SMTP settings are provided. Messages are always saved in the database first, so a mail
 * failure never loses a message.
 */
@Slf4j
@Service
public class NotificationService {

    private final NotificationProperties properties;
    private final ObjectProvider<JavaMailSender> mailSender;

    public NotificationService(NotificationProperties properties, ObjectProvider<JavaMailSender> mailSender) {
        this.properties = properties;
        this.mailSender = mailSender;
    }

    public boolean isEnabled() {
        return properties.enabled() && StringUtils.hasText(properties.to()) && mailSender.getIfAvailable() != null;
    }

    @Async
    public void notifyNewMessage(ContactMessage message) {
        if (!isEnabled()) {
            return;
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(properties.to());
            if (StringUtils.hasText(properties.from())) {
                mail.setFrom(properties.from());
            }
            mail.setReplyTo(message.getEmail());
            mail.setSubject("[Portfolio] " + message.getSubject());
            mail.setText("From: " + message.getName() + " <" + message.getEmail() + ">\n\n" + message.getMessage());
            mailSender.getObject().send(mail);
        } catch (Exception ex) {
            log.warn("Could not send contact notification e-mail: {}", ex.getMessage());
        }
    }
}
