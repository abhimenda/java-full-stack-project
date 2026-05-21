package com.taskportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AiRequest {

    @NotBlank(message = "Title is required for AI generation")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
}
