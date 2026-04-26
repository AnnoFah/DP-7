import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [score, setScore] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topApps, setTopApps] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Focus score hari ini
    const { data: scoreData } = await api.get('/activities/focus-score');
    setScore(scoreData);

    // Data 7 hari terakhir
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const weekScores = await Promise.all(
      dates.map(async (date) => {
        const { data } = await api.get(`/activities/focus-score?date=${date}`);
        return { date: date.slice(5), score: data.focusScore, produktif: data.produktif, distraksi: data.distraksi };
      })
    );
    setWeeklyData(weekScores);

    // Top apps
    const { data: acts } = await api.get(`/activities?start_date=${dates[0]}&end_date=${dates[6]}`);
    const appMap = {};
    acts.forEach(a => {
      if (!appMap[a.app_name]) appMap[a.app_name] = { menit: 0, category: a.category };
      appMap[a.app_name].menit += a.duration_minutes;
    });
    const sorted = Object.entries(appMap).map(([name, v]) => ({ name, ...v })).sort((a,b) => b.menit - a.menit).slice(0, 5);
    setTopApps(sorted);
  };

  const StatCard = ({ icon, label, value, color, sub }) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#1e1b4b' }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{ background: color + '20', padding: 10, borderRadius: 10 }}>{icon}</div>
      </div>
    </div>
  );

  const scoreColor = score?.focusScore >= 70 ? '#10b981' : score?.focusScore >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>
          👋 Halo, {user?.profile?.nama || 'User'}!
        </h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Pantau fokus dan screen time kamu hari ini</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard
          icon={<Zap size={20} color="#7c3aed" />}
          label="Focus Score Hari Ini"
          value={`${score?.focusScore || 0}%`}
          color={scoreColor}
          sub={score?.focusScore >= 70 ? '🔥 Sangat Fokus!' : score?.focusScore >= 40 ? '⚡ Cukup Baik' : '⚠️ Perlu Ditingkatkan'}
        />
        <StatCard
          icon={<Clock size={20} color="#2563eb" />}
          label="Total Screen Time"
          value={`${Math.round((score?.totalMenit || 0) / 60 * 10) / 10} jam`}
          color="#2563eb"
          sub={`${score?.totalMenit || 0} menit total`}
        />
        <StatCard
          icon={<Activity size={20} color="#10b981" />}
          label="Waktu Produktif"
          value={`${Math.round((score?.produktif || 0) / 60 * 10) / 10} jam`}
          color="#10b981"
          sub="Kerja, belajar, dll"
        />
        <StatCard
          icon={<AlertTriangle size={20} color="#ef4444" />}
          label="Waktu Distraksi"
          value={`${Math.round((score?.distraksi || 0) / 60 * 10) / 10} jam`}
          color="#ef4444"
          sub="Hiburan, sosmed, dll"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Weekly Chart */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: 16, color: '#1e1b4b', fontWeight: 600 }}>📊 Focus Score 7 Hari Terakhir</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Focus Score']} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {weeklyData.map((entry, i) => (
                  <Cell key={i} fill={entry.score >= 70 ? '#7c3aed' : entry.score >= 40 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Apps */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: 16, color: '#1e1b4b', fontWeight: 600 }}>📱 Aplikasi Terpakai</h3>
          {topApps.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: 40, fontSize: 14 }}>Belum ada data minggu ini</p>
          ) : (
            topApps.map((app, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: app.category === 'produktif' ? '#10b981' : '#ef4444',
                    display: 'inline-block'
                  }} />
                  <span style={{ fontSize: 14, color: '#374151' }}>{app.name}</span>
                </div>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                  {Math.round(app.menit / 60 * 10) / 10}j
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}