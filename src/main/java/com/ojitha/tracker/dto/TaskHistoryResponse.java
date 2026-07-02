package com.ojitha.tracker.dto;

import com.ojitha.tracker.entity.TaskHistory.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskHistoryResponse {

    private Long id;
    private Long taskId;
    private String taskTitle;
    private LocalDate date;
    private TaskStatus status;
    private LocalDateTime completedTime;
}