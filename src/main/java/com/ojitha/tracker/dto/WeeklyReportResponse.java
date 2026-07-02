package com.ojitha.tracker.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReportResponse {
    private String taskTitle;
    private Long taskId;
    private Map<String, String> dailyStatus;
}
