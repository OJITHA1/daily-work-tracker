import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const statusEmoji = {
  COMPLETED: 'V',
  MISSED: 'X',
  PENDING: '?',
  FUTURE: '-',
};

const statusColor = {
  COMPLETED: '#4caf50',
  MISSED: '#e53935',
  PENDING: '#ff9800',
  FUTURE: '#bdbdbd',
};

function WeeklyReport() {
  const [report, setReport] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tasks/weekly')
      .then(res => setReport(res.data))
      .catch(() => navigate('/'));
  }, [navigate]);

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #1976d2', paddingBottom: '16px' }}>
        <h1 style={{ margin: 0, color: '#1976d2' }}>Weekly Report</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Back to Dashboard</button>
      </div>
      {report.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No tasks found. Add tasks from the dashboard first.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1976d2', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Task</th>
              {days.map(d => <th key={d} style={{ padding: '12px', textAlign: 'center' }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {report.map((row, i) => (
              <tr key={row.taskId} style={{ background: i % 2 === 0 ? '#f5f5f5' : 'white' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.taskTitle}</td>
                {days.map(d => {
                  const status = row.dailyStatus[d] || 'FUTURE';
                  return (
                    <td key={d} style={{ padding: '12px', textAlign: 'center', color: statusColor[status], fontSize: '18px', fontWeight: 'bold' }}>
                      {statusEmoji[status]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WeeklyReport;
