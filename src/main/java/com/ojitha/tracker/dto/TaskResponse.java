package com.ojitha.tracker.dto;

import com.ojitha.tracker.entity.TaskHistory.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private LocalTime scheduledTime;
    private String repeatType;
    private Boolean active;
    private TaskStatus todayStatus;
}