import React, { useState } from 'react';
import api from '../api/axios';

const statusEmoji = {
  PENDING: '🟡',
  COMPLETED: '🟢',
  MISSED: '🔴',
};

const statusColor = {
  PENDING: '#fff8e1',
  COMPLETED: '#e8f5e9',
  MISSED: '#ffebee',
};

function TaskCard({ task, onComplete }) {
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const handleStats = async () => {
    if (showStats) {
      setShowStats(false);
      return;
    }
    const res = await api.get('/tasks/' + task.id + '/stats');
    setStats(res.data);
    setShowStats(true);
  };

  return (
    <div style={{
      background: statusColor[task.todayStatus],
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      width: '300px',
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{task.scheduledTime}</h3>
      <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{task.title}</p>
      <p style={{ margin: '0 0 12px 0' }}>{task.description}</p>
      <p>Status: {statusEmoji[task.todayStatus]} {task.todayStatus}</p>
      {task.todayStatus === 'PENDING' && (
        <button
          onClick={() => onComplete(task.id)}
          style={{
            background: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          Complete
        </button>
      )}
      <button
        onClick={handleStats}
        style={{
          background: '#1976d2',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        {showStats ? 'Hide Stats' : '📊 Stats'}
      </button>
      {showStats && stats && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'white',
          borderRadius: '4px',
          border: '1px solid #eee',
        }}>
          <p style={{ margin: '0 0 4px 0' }}>🟢 Completed: {stats.completedCount}</p>
          <p style={{ margin: '0' }}>🔴 Missed: {stats.missedCount}</p>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
