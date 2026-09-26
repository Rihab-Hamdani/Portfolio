package com.rihab.portfolio.dto;

import com.rihab.portfolio.entity.Screenshot;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ScreenshotDto(
        @NotBlank(message = "Screenshot source is required.") @Size(max = 500) String src,
        @Size(max = 200) String caption,
        @Size(max = 300) String alt) {

    public static ScreenshotDto from(Screenshot s) {
        return new ScreenshotDto(s.src(), s.caption(), s.alt());
    }

    public Screenshot toEntity() {
        return new Screenshot(src, caption, alt);
    }
}
