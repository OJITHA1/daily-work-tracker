import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/today");
      setTasks(res.data);
    } catch (err) {
      navigate("/");
    }
  };

  const handleComplete = async (id) => {
    await api.put(`/tasks/${id}/complete`);
    fetchTasks();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    await api.post("/tasks", { title, scheduledTime: scheduledTime + ":00", repeatType: "DAILY" });
    setTitle("");
    setScheduledTime("");
    setShowForm(false);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <div className="navbar">
        <div>
          <div className="navbar-brand">Daily Work Tracker</div>
          <div className="navbar-subtitle">Welcome, {name} — {new Date().toDateString()}</div>
        </div>
        <div className="navbar-actions">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Task</button>
          <button className="btn-purple" onClick={() => navigate("/weekly")}>Weekly Report</button>
          <button className="btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="page-container">
        {showForm && (
          <div className="add-form">
            <form onSubmit={handleAddTask} style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "200px" }} />
              <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
              <button type="submit" className="btn-success">Save Task</button>
            </form>
          </div>
        )}
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks for today. Click + Add Task to get started.</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
