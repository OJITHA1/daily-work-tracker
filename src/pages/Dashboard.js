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
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "2px solid #1976d2", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ margin: 0, color: "#1976d2" }}>Daily Work Tracker</h1>
          <p style={{ margin: "4px 0 0 0" }}>Welcome, {name} - {new Date().toDateString()}</p>
        </div>
        <div>
          <button onClick={() => setShowForm(!showForm)} style={{ marginRight: "8px", padding: "8px 16px", background: "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            + Add Task
          </button>
          <button onClick={() => navigate("/weekly")} style={{ marginRight: "8px", padding: "8px 16px", background: "#7b1fa2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Weekly Report
          </button>
          <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#e53935", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>
      {showForm && (
        <div style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "24px" }}>
          <h3>Add New Task</h3>
          <form onSubmit={handleAddTask}>
            <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}
              style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ddd", width: "200px" }} />
            <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
              style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
            <button type="submit" style={{ padding: "8px 16px", background: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Save</button>
          </form>
        </div>
      )}
      {tasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>No tasks for today. Click + Add Task to get started.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
