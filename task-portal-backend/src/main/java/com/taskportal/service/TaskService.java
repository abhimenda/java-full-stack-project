package com.taskportal.service;

import com.taskportal.dto.request.TaskRequest;
import com.taskportal.dto.response.TaskResponse;
import com.taskportal.entity.Task;
import com.taskportal.entity.Task.TaskStatus;
import com.taskportal.entity.User;
import com.taskportal.exception.ResourceNotFoundException;
import com.taskportal.exception.UnauthorizedException;
import com.taskportal.repository.TaskRepository;
import com.taskportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getAllTasks() {
        Long userId = getCurrentUserId();
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Page<TaskResponse> getAllTasksPaged(Pageable pageable) {
        Long userId = getCurrentUserId();
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }

    public List<TaskResponse> searchTasks(String keyword) {
        Long userId = getCurrentUserId();
        return taskRepository.searchByUserIdAndKeyword(userId, keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Long userId = getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return toResponse(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .user(user)
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Long userId = getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Long userId = getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setStatus(status);
        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        Long userId = getCurrentUserId();
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    public Map<String, Long> getTaskStats() {
        Long userId = getCurrentUserId();
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", taskRepository.countByUserId(userId));
        stats.put("todo", taskRepository.countByUserIdAndStatus(userId, TaskStatus.TODO));
        stats.put("inProgress", taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS));
        stats.put("done", taskRepository.countByUserIdAndStatus(userId, TaskStatus.DONE));
        return stats;
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not authenticated"))
                .getId();
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .userId(task.getUser().getId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
