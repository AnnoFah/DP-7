import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, UserCheck, BarChart2, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data));
  }, []);

  const cards = stats ? [
    { label: 'Total User', value: stats.totalUsers, icon: <Users size={20} color="#4f46e5" />, color: '#4f46e5' },
    { label: 'User Aktif Hari Ini', value: stats.activeUsers, icon: <UserCheck size={20} color="#10b981" />, color: '#10b981' },
    { label: 'Rata-rata Focus Score', value: `${stats.avgFocusScore}%`, icon: <BarChart2 size={20} color="#7c3aed" />, color: '#7c3aed' },
    { label: 'Warning Hari Ini', value: stats.warningCount, icon: <AlertTriangle size={20} color="#ef4444" />, color: '#ef4444' },
  ] : [];

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>👨‍💼 Dashboard Admin</h1>
      <p style={{ color: '#6b7280', marginBottom: 28 }}>Overview keseluruhan sistem</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderTop: `3px solid ${c.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{c.label}</span>
              <div style={{ background: c.color + '15', padding: 8, borderRadius: 8 }}>{c.icon}</div>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#1e1b4b' }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}