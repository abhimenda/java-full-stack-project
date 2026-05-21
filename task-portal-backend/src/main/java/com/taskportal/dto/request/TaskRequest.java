package com.taskportal.dto.request;

import com.taskportal.entity.Task.Priority;
import com.taskportal.entity.Task.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    private Priority priority = Priority.MEDIUM;

    private LocalDate dueDate;

    private TaskStatus status = TaskStatus.TODO;
}
