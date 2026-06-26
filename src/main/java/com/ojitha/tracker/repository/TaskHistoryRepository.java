package com.ojitha.tracker.repository;

import com.ojitha.tracker.entity.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
    List<TaskHistory> findByTaskId(Long taskId);
    Optional<TaskHistory> findByTaskIdAndDate(Long taskId, LocalDate date);
    List<TaskHistory> findByTaskIdAndDateBetween(Long taskId, LocalDate startDate, LocalDate endDate);
}
