import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'produktif', label: '✅ Produktif', color: '#10b981' },
  { value: 'hiburan', label: '🎮 Hiburan', color: '#ef4444' },
  { value: 'lainnya', label: '📌 Lainnya', color: '#6b7280' },
];

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ app_name: '', duration_minutes: '', activity_date: new Date().toISOString().split('T')[0] });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, [filterDate]);

  const fetchActivities = async () => {
    const { data } = await api.get(`/activities?date=${filterDate}`);
    setActivities(data);
  };

  const fetchCategories = async () => {
    const { data } = await api.get('/admin/categories');
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/activities/${editId}`, form);
        toast.success('Aktivitas diperbarui!');
      } else {
        await api.post('/activities', form);
        toast.success('Aktivitas ditambahkan!');
      }
      setForm({ app_name: '', duration_minutes: '', activity_date: filterDate });
      setEditId(null);
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menyimpan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus aktivitas ini?')) return;
    await api.delete(`/activities/${id}`);
    toast.success('Dihapus!');
    fetchActivities();
  };

  const handleEdit = (act) => {
    setForm({ app_name: act.app_name, duration_minutes: act.duration_minutes, activity_date: act.activity_date });
    setEditId(act.id);
    setShowForm(true);
  };

  const totalMenit = activities.reduce((s, a) => s + a.duration_minutes, 0);
  const totalProduktif = activities.filter(a => a.category === 'produktif').reduce((s, a) => s + a.duration_minutes, 0);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>📱 Input Aktivitas</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Catat penggunaan aplikasimu hari ini</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ app_name: '', duration_minutes: '', activity_date: filterDate }); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Screen Time', value: `${Math.round(totalMenit / 60 * 10) / 10} jam`, color: '#4f46e5' },
          { label: 'Produktif', value: `${Math.round(totalProduktif / 60 * 10) / 10} jam`, color: '#10b981' },
          { label: 'Distraksi', value: `${Math.round((totalMenit - totalProduktif) / 60 * 10) / 10} jam`, color: '#ef4444' },
          { label: 'Focus Score', value: `${totalMenit > 0 ? Math.round(totalProduktif / totalMenit * 100) : 0}%`, color: '#7c3aed' },
        ].map(stat => (
          <div key={stat.label} style={{ flex: 1, background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderTop: `3px solid ${stat.color}` }}>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{stat.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: 16, color: '#1e1b4b', fontWeight: 600 }}>
            {editId ? '✏️ Edit Aktivitas' : '➕ Tambah Aktivitas'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 150 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Nama Aplikasi</label>
              <input list="app-list" value={form.app_name} placeholder="Contoh: VSCode, TikTok..."
                onChange={e => setForm({...form, app_name: e.target.value})} required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
              <datalist id="app-list">
                {categories.map(c => <option key={c.id} value={c.app_name} />)}
              </datalist>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Durasi (menit)</label>
              <input type="number" value={form.duration_minutes} placeholder="60" min="1"
                onChange={e => setForm({...form, duration_minutes: e.target.value})} required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Tanggal</label>
              <input type="date" value={form.activity_date}
                onChange={e => setForm({...form, activity_date: e.target.value})} required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '9px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 16px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Aplikasi', 'Durasi', 'Kategori', 'Tanggal', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Belum ada aktivitas pada tanggal ini</td></tr>
            ) : activities.map(act => {
              const cat = CATEGORIES.find(c => c.value === act.category);
              return (
                <tr key={act.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e1b4b' }}>{act.app_name}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{act.duration_minutes} menit ({Math.round(act.duration_minutes/60*10)/10} jam)</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: cat?.color + '20', color: cat?.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {cat?.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>{act.activity_date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(act)} style={{ padding: '6px 10px', background: '#eff6ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#2563eb' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(act.id)} style={{ padding: '6px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}