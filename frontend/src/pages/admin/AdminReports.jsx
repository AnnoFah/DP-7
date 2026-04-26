import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminReports() {
  const [report, setReport] = useState([]);

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async () => {
    const { data } = await api.get('/admin/reports');
    setReport(data);
  };

  const getScoreColor = (s) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', marginBottom: 24 }}>📈 Laporan Global (7 Hari)</h1>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['User', 'Total Screen Time', 'Produktif', 'Distraksi', 'Focus Score', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Tidak ada data</td></tr>
            ) : report.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e1b4b' }}>{r.nama}</td>
                <td style={{ padding: '12px 16px', color: '#374151' }}>{Math.round(r.total_menit/60*10)/10} jam</td>
                <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 500 }}>{Math.round(r.produktif_menit/60*10)/10} jam</td>
                <td style={{ padding: '12px 16px', color: '#ef4444', fontWeight: 500 }}>{Math.round(r.distraksi_menit/60*10)/10} jam</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontWeight: 700, color: getScoreColor(r.focus_score), fontSize: 16 }}>{r.focus_score}%</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: getScoreColor(r.focus_score) + '20', color: getScoreColor(r.focus_score), padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {r.focus_score >= 70 ? 'Baik' : r.focus_score >= 40 ? 'Cukup' : 'Perlu Perhatian'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}