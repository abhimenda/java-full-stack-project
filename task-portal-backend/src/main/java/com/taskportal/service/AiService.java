package com.taskportal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskportal.dto.response.AiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    public AiResponse generateTaskDetails(String title) {
        try {
            String prompt = buildPrompt(title);
            String rawResponse = callGeminiApi(prompt);
            return parseGeminiResponse(rawResponse);
        } catch (Exception e) {
            log.error("Gemini API call failed for title '{}': {}", title, e.getMessage(), e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Unknown error";
            if (errorMsg.contains("400") || errorMsg.contains("API key not valid")) {
                errorMsg = "Invalid API Key. Please check your application.properties and restart the backend.";
            } else if (errorMsg.contains("YOUR_GEMINI_API_KEY")) {
                errorMsg = "API key not configured. Please add it and restart the backend.";
            }
            return AiResponse.builder()
                    .message("AI Error: " + errorMsg + " (Please enter manually)")
                    .build();
        }
    }

    private String buildPrompt(String title) {
        return String.format("""
                You are a project management assistant. Based on the task title below, generate structured task details.

                Task Title: "%s"

                Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
                {
                  "description": "A clear, actionable task description in 2-3 sentences",
                  "priority": "HIGH or MEDIUM or LOW or URGENT",
                  "estimatedTime": "e.g., 2 hours or 3 days"
                }
                """, title);
    }

    private String callGeminiApi(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 1024,
                        "responseMimeType", "application/json"
                )
        );

        return webClientBuilder.build()
                .post()
                .uri(java.net.URI.create(geminiApiUrl + "?key=" + geminiApiKey.trim()))
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    private AiResponse parseGeminiResponse(String rawResponse) throws Exception {
        JsonNode root = objectMapper.readTree(rawResponse);
        String text = root
                .path("candidates").get(0)
                .path("content")
                .path("parts").get(0)
                .path("text")
                .asText();

        // Strip markdown code fences if present
        text = text.replaceAll("```json", "").replaceAll("```", "").trim();

        JsonNode parsed = objectMapper.readTree(text);
        return AiResponse.builder()
                .description(parsed.path("description").asText(""))
                .priority(parsed.path("priority").asText("MEDIUM"))
                .estimatedTime(parsed.path("estimatedTime").asText(""))
                .build();
    }
}
