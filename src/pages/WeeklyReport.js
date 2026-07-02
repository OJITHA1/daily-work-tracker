import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function WeeklyReport() {
  const [report, setReport] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/tasks/weekly")
      .then(res => setReport(res.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const statusClass = (status) => {
    if (status === "COMPLETED") return "status-completed";
    if (status === "MISSED") return "status-missed";
    if (status === "PENDING") return "status-pending";
    return "status-future";
  };

  const statusIcon = (status) => {
    if (status === "COMPLETED") return "✔";
    if (status === "MISSED") return "✖";
    if (status === "PENDING") return "?";
    return "-";
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-brand">Weekly Report</div>
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
      <div className="page-container">
        {report.length === 0 ? (
          <p className="empty-state">No tasks found. Add tasks from the dashboard first.</p>
        ) : (
          <table className="weekly-table">
            <thead>
              <tr>
                <th>Task</th>
                {days.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {report.map((row) => (
                <tr key={row.taskId}>
                  <td>{row.taskTitle}</td>
                  {days.map(d => {
                    const status = row.dailyStatus[d] || "FUTURE";
                    return <td key={d} className={statusClass(status)}>{statusIcon(status)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default WeeklyReport;
