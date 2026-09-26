package com.rihab.portfolio.controller.admin;

import com.rihab.portfolio.dto.ContactMessageDto;
import com.rihab.portfolio.dto.MessageStatusRequest;
import com.rihab.portfolio.dto.PageResponse;
import com.rihab.portfolio.entity.MessageStatus;
import com.rihab.portfolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/messages")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminMessageController {

    private final ContactService contactService;

    @GetMapping
    public PageResponse<ContactMessageDto> list(
            @RequestParam(required = false) MessageStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return contactService.list(status, page, size);
    }

    @PatchMapping("/{id}")
    public ContactMessageDto updateStatus(@PathVariable UUID id, @Valid @RequestBody MessageStatusRequest request) {
        return contactService.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        contactService.delete(id);
    }
}
