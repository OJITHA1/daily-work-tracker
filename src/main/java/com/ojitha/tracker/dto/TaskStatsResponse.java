package com.ojitha.tracker.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatsResponse {
    private Long taskId;
    private String taskTitle;
    private long completedCount;
    private long missedCount;
}
