package com.rihab.portfolio.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record ReorderRequest(@NotEmpty(message = "Provide the ordered list of ids.") List<@NotNull UUID> ids) {
}
