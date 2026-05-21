package com.taskportal.controller;

import com.taskportal.dto.request.AiRequest;
import com.taskportal.dto.response.AiResponse;
import com.taskportal.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "AI-powered task generation APIs")
@SecurityRequirement(name = "bearerAuth")
public class AiController {

    private final AiService aiService;

    @PostMapping("/generate")
    @Operation(summary = "Generate task details using Gemini AI")
    public ResponseEntity<AiResponse> generateTaskDetails(@Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(aiService.generateTaskDetails(request.getTitle()));
    }
}
