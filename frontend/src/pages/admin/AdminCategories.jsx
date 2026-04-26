import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ app_name: '', category: 'produktif' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchCats(); }, []);

  const fetchCats = async () => {
    const { data } = await api.get('/admin/categories');
    setCats(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, form);
        toast.success('Kategori diperbarui');
      } else {
        await api.post('/admin/categories', form);
        toast.success('Kategori ditambahkan');
      }
      setForm({ app_name: '', category: 'produktif' });
      setEditId(null);
      setShowForm(false);
      fetchCats();
    } catch { toast.error('Gagal menyimpan'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kategori ini?')) return;
    await api.delete(`/admin/categories/${id}`);
    toast.success('Dihapus');
    fetchCats();
  };

  const catColor = { produktif: '#10b981', hiburan: '#ef4444', lainnya: '#6b7280' };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>🏷️ Kelola Kategori Aplikasi</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ app_name: '', category: 'produktif' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={16} /> Tambah
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Nama Aplikasi</label>
            <input value={form.app_name} onChange={e => setForm({...form, app_name: e.target.value})} required placeholder="Nama aplikasi"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Kategori</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
              <option value="produktif">✅ Produktif</option>
              <option value="hiburan">🎮 Hiburan</option>
              <option value="lainnya">📌 Lainnya</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '9px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 16px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Batal</button>
          </div>
        </form>
      )}

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Nama Aplikasi', 'Kategori', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e1b4b' }}>{c.app_name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: catColor[c.category] + '20', color: catColor[c.category], padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.category}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setForm({ app_name: c.app_name, category: c.category }); setEditId(c.id); setShowForm(true); }}
                      style={{ padding: '6px 10px', background: '#eff6ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#2563eb' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(c.id)}
                      style={{ padding: '6px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}