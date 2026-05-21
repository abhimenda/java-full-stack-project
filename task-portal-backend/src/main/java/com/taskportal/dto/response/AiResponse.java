package com.taskportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiResponse {
    private String description;
    private String priority;
    private String estimatedTime;
    private String message;
}
