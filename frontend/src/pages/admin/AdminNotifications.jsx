import { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function AdminNotifications() {
  const [form, setForm] = useState({ title: '', message: '', target: 'all' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/notifications', form);
      toast.success(data.message);
      setForm({ title: '', message: '', target: 'all' });
    } catch {
      toast.error('Gagal kirim notifikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 28, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', marginBottom: 24 }}>📢 Kirim Notifikasi</h1>
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Judul</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Judul notifikasi"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Pesan</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={4}
              placeholder="Isi pesan notifikasi..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Tujuan</label>
            <select value={form.target} onChange={e => setForm({...form, target: e.target.value})}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
              <option value="all">Semua User</option>
              <option value="warning_users">User dengan Warning Hari Ini</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: '12px 0', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
            <Send size={18} /> {loading ? 'Mengirim...' : 'Kirim Notifikasi'}
          </button>
        </form>
      </div>
    </div>
  );
}