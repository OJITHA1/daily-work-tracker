package com.ojitha.tracker.service;

import com.ojitha.tracker.dto.TaskRequest;
import com.ojitha.tracker.dto.TaskResponse;
import com.ojitha.tracker.dto.TaskStatsResponse;
import com.ojitha.tracker.dto.WeeklyReportResponse;
import com.ojitha.tracker.entity.Task;
import com.ojitha.tracker.entity.TaskHistory;
import com.ojitha.tracker.entity.TaskHistory.TaskStatus;
import com.ojitha.tracker.entity.User;
import com.ojitha.tracker.repository.TaskHistoryRepository;
import com.ojitha.tracker.repository.TaskRepository;
import com.ojitha.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskHistoryRepository taskHistoryRepository;
    private final UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Task task = new Task();
        task.setUser(user);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setScheduledTime(request.getScheduledTime());
        task.setRepeatType(request.getRepeatType());
        taskRepository.save(task);
        return mapToResponse(task, TaskStatus.PENDING);
    }

    public List<TaskResponse> getTodayTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<Task> tasks = taskRepository.findByUserIdAndActiveTrue(user.getId());
        LocalDate today = LocalDate.now();
        return tasks.stream()
                .map(task -> {
                    TaskStatus status = taskHistoryRepository
                            .findByTaskIdAndDate(task.getId(), today)
                            .map(TaskHistory::getStatus)
                            .orElse(computeStatus(task));
                    return mapToResponse(task, status);
                })
                .collect(Collectors.toList());
    }

    public TaskResponse completeTask(Long taskId, String email) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        LocalDate today = LocalDate.now();
        TaskHistory history = taskHistoryRepository
                .findByTaskIdAndDate(taskId, today)
                .orElse(new TaskHistory());
        history.setTask(task);
        history.setDate(today);
        history.setStatus(TaskStatus.COMPLETED);
        history.setCompletedTime(java.time.LocalDateTime.now());
        taskHistoryRepository.save(history);
        return mapToResponse(task, TaskStatus.COMPLETED);
    }

    public TaskStatsResponse getTaskStats(Long taskId, String email) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        List<TaskHistory> history = taskHistoryRepository.findByTaskId(taskId);
        long completedCount = history.stream()
                .filter(h -> h.getStatus() == TaskStatus.COMPLETED)
                .count();
        long missedCount = history.stream()
                .filter(h -> h.getStatus() == TaskStatus.MISSED)
                .count();
        return new TaskStatsResponse(task.getId(), task.getTitle(), completedCount, missedCount);
    }

    public List<WeeklyReportResponse> getWeeklyReport(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        List<Task> tasks = taskRepository.findByUserIdAndActiveTrue(user.getId());
        return tasks.stream().map(task -> {
            List<TaskHistory> history = taskHistoryRepository
                    .findByTaskIdAndDateBetween(task.getId(), startOfWeek, today);
            Map<String, String> dailyStatus = new LinkedHashMap<>();
            for (int i = 0; i < 7; i++) {
                LocalDate day = startOfWeek.plusDays(i);
                String dayName = day.getDayOfWeek().toString().substring(0, 3);
                String status = history.stream()
                        .filter(h -> h.getDate().equals(day))
                        .map(h -> h.getStatus().toString())
                        .findFirst()
                        .orElse(day.isAfter(today) ? "FUTURE" : "PENDING");
                dailyStatus.put(dayName, status);
            }
            return new WeeklyReportResponse(task.getTitle(), task.getId(), dailyStatus);
        }).collect(Collectors.toList());
    }

    private TaskStatus computeStatus(Task task) {
        LocalTime now = LocalTime.now();
        if (now.isBefore(task.getScheduledTime())) {
            return TaskStatus.PENDING;
        } else {
            return TaskStatus.MISSED;
        }
    }

    private TaskResponse mapToResponse(Task task, TaskStatus status) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getScheduledTime(),
                task.getRepeatType(),
                task.getActive(),
                status
        );
    }
}
