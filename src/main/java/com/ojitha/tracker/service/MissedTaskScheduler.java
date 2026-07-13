package com.ojitha.tracker.service;
import com.ojitha.tracker.entity.Task;
import com.ojitha.tracker.entity.TaskHistory;
import com.ojitha.tracker.entity.TaskHistory.TaskStatus;
import com.ojitha.tracker.repository.TaskHistoryRepository;
import com.ojitha.tracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@Component
@RequiredArgsConstructor
public class MissedTaskScheduler {
    private final TaskRepository taskRepository;
    private final TaskHistoryRepository taskHistoryRepository;
    @Scheduled(fixedRate = 60000)
    public void markMissedTasks() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<Task> tasks = taskRepository.findAll();
        for (Task task : tasks) {
            if (!task.getActive()) continue;
            if (now.isBefore(task.getScheduledTime())) continue;
            boolean exists = taskHistoryRepository
                    .findByTaskIdAndDate(task.getId(), today).isPresent();
            if (!exists) {
                TaskHistory history = new TaskHistory();
                history.setTask(task);
                history.setDate(today);
                history.setStatus(TaskStatus.MISSED);
                taskHistoryRepository.save(history);
            }
        }
    }
}
