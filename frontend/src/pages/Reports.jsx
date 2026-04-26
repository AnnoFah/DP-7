import { useEffect, useState } from 'react';
import api from '../api/axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Reports() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    // 7 hari
    const dates7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      dates7.push(d.toISOString().split('T')[0]);
    }
    const week = await Promise.all(dates7.map(async date => {
      const { data } = await api.get(`/activities/focus-score?date=${date}`);
      return { date: date.slice(5), ...data };
    }));
    setWeeklyData(week);

    // 30 hari (ambil per 5 hari untuk ringkas)
    const dates30 = [];
    for (let i = 29; i >= 0; i -= 3) {
      const d = new Date(); d.setDate(d.getDate() - i);
      dates30.push(d.toISOString().split('T')[0]);
    }
    const month = await Promise.all(dates30.map(async date => {
      const { data } = await api.get(`/activities/focus-score?date=${date}`);
      return { date: date.slice(5), score: data.focusScore, produktif: Math.round(data.produktif/60*10)/10, distraksi: Math.round(data.distraksi/60*10)/10 };
    }));
    setMonthlyData(month);
  };

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>📊 Laporan Statistik</h1>
      <p style={{ color: '#6b7280', marginBottom: 28 }}>Analisis pola fokus dan screen time kamu</p>

      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: 16, color: '#1e1b4b', fontWeight: 600 }}>📈 Focus Score Mingguan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0,100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v, n) => [n === 'focusScore' ? `${v}%` : `${v} menit`, n === 'focusScore' ? 'Focus Score' : n]} />
              <Line type="monotone" dataKey="focusScore" stroke="#7c3aed" strokeWidth={3} dot={{ r: 5 }} name="Focus Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: 16, color: '#1e1b4b', fontWeight: 600 }}>⏱️ Produktif vs Distraksi (30 Hari, dalam jam)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="produktif" fill="#7c3aed" name="Produktif (jam)" radius={[4,4,0,0]} />
              <Bar dataKey="distraksi" fill="#f87171" name="Distraksi (jam)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}