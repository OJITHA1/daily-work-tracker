import React, { useState } from "react";
import api from "../api/axios";

function TaskCard({ task, onComplete }) {
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const statusClass = task.todayStatus ? task.todayStatus.toLowerCase() : "pending";

  const statusLabel = {
    PENDING: "🟡 Pending",
    COMPLETED: "🟢 Completed",
    MISSED: "🔴 Missed",
  };

  const handleStats = async () => {
    if (showStats) { setShowStats(false); return; }
    const res = await api.get("/tasks/" + task.id + "/stats");
    setStats(res.data);
    setShowStats(true);
  };

  return (
    <div className={`task-card ${statusClass}`}>
      <div className="task-time">{task.scheduledTime}</div>
      <div className="task-title">{task.title}</div>
      {task.description && <div className="task-desc">{task.description}</div>}
      <div className="task-status">{statusLabel[task.todayStatus]}</div>
      <div className="task-actions">
        {task.todayStatus === "PENDING" && (
          <button className="btn-success" onClick={() => onComplete(task.id)}>Complete</button>
        )}
        <button className="btn-primary" onClick={handleStats}>
          {showStats ? "Hide Stats" : "📊 Stats"}
        </button>
      </div>
      {showStats && stats && (
        <div className="stats-panel">
          <div className="stats-row">
            <span>🟢 Completed</span>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>{stats.completedCount}</span>
          </div>
          <div className="stats-row">
            <span>🔴 Missed</span>
            <span style={{ color: "var(--red)", fontWeight: 600 }}>{stats.missedCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
