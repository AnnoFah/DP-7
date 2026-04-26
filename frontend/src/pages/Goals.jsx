import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Target } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ goal_type: 'min_productive', app_name: '', target_minutes: '', target_percentage: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    const { data } = await api.get('/goals');
    setGoals(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', form);
      toast.success('Target ditambahkan!');
      setForm({ goal_type: 'min_productive', app_name: '', target_minutes: '', target_percentage: '' });
      setShowForm(false);
      fetchGoals();
    } catch (err) {
      toast.error('Gagal menambah target');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/goals/${id}`);
    toast.success('Target dihapus');
    fetchGoals();
  };

  const GOAL_TYPES = {
    max_distraction: { label: '🚫 Batas Distraksi', color: '#ef4444' },
    min_productive: { label: '✅ Minimum Produktif', color: '#10b981' },
    min_focus_score: { label: '🎯 Minimum Focus Score', color: '#7c3aed' },
  };

  return (
    <div style={{ padding: 28, maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>🎯 Target & Goals</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Set target harian untuk meningkatkan fokus</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={16} /> Tambah Target
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: 16, fontWeight: 600, color: '#1e1b4b' }}>➕ Tambah Target</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Tipe Target</label>
              <select value={form.goal_type} onChange={e => setForm({...form, goal_type: e.target.value})}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
                {Object.entries(GOAL_TYPES).map(([v, l]) => <option key={v} value={v}>{l.label}</option>)}
              </select>
            </div>
            {form.goal_type === 'max_distraction' && (
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Nama Aplikasi (opsional)</label>
                <input value={form.app_name} onChange={e => setForm({...form, app_name: e.target.value})} placeholder="Contoh: TikTok"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            )}
            {(form.goal_type === 'max_distraction' || form.goal_type === 'min_productive') && (
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                  {form.goal_type === 'max_distraction' ? 'Batas Maksimal (menit)' : 'Target Minimum (menit)'}
                </label>
                <input type="number" value={form.target_minutes} min="1" onChange={e => setForm({...form, target_minutes: e.target.value})} required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            )}
            {form.goal_type === 'min_focus_score' && (
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Target Focus Score (%)</label>
                <input type="number" value={form.target_percentage} min="1" max="100" onChange={e => setForm({...form, target_percentage: e.target.value})} required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '9px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 16px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#fff', borderRadius: 12 }}>
            <Target size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>Belum ada target. Tambahkan target pertamamu!</p>
          </div>
        ) : goals.map(goal => {
          const type = GOAL_TYPES[goal.goal_type];
          return (
            <div key={goal.id} style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${type.color}` }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: type.color }}>{type.label}</span>
                {goal.app_name && <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 8 }}>({goal.app_name})</span>}
                <p style={{ color: '#374151', marginTop: 4, fontSize: 15, fontWeight: 500 }}>
                  {goal.target_minutes ? `${goal.target_minutes} menit` : `${goal.target_percentage}%`}
                </p>
              </div>
              <button onClick={() => handleDelete(goal.id)} style={{ padding: '8px 12px', background: '#fef2f2', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#ef4444' }}>
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}