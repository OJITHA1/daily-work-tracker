package com.ojitha.tracker.controller;

import com.ojitha.tracker.dto.TaskRequest;
import com.ojitha.tracker.dto.TaskResponse;
import com.ojitha.tracker.dto.TaskStatsResponse;
import com.ojitha.tracker.dto.WeeklyReportResponse;
import com.ojitha.tracker.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.createTask(request, userDetails.getUsername()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<TaskResponse>> getTodayTasks(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTodayTasks(userDetails.getUsername()));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.completeTask(id, userDetails.getUsername()));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<TaskStatsResponse> getTaskStats(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTaskStats(id, userDetails.getUsername()));
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<WeeklyReportResponse>> getWeeklyReport(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getWeeklyReport(userDetails.getUsername()));
    }
}
