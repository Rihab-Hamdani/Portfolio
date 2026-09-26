package com.rihab.portfolio.controller;

import com.rihab.portfolio.dto.ContactRequest;
import com.rihab.portfolio.dto.ContactResponse;
import com.rihab.portfolio.service.ContactService;
import com.rihab.portfolio.util.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    static final String SUCCESS_MESSAGE = "Thanks for your message. I'll get back to you soon.";

    private final ContactService contactService;
    private final ClientIpResolver clientIpResolver;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse submit(@Valid @RequestBody ContactRequest request, HttpServletRequest httpRequest) {
        contactService.submit(request, clientIpResolver.resolve(httpRequest));
        return new ContactResponse(SUCCESS_MESSAGE);
    }
}
