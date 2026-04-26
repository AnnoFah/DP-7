import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const MOODS = [
  { value: 'sangat_fokus', label: '🔥 Sangat Fokus' },
  { value: 'fokus', label: '✅ Fokus' },
  { value: 'netral', label: '😐 Netral' },
  { value: 'terganggu', label: '😕 Terganggu' },
  { value: 'sangat_terganggu', label: '😫 Sangat Terganggu' },
];

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ content: '', mood: 'netral', note_date: new Date().toISOString().split('T')[0] });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    const { data } = await api.get('/notes');
    setNotes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notes', form);
      toast.success('Catatan disimpan!');
      setForm({ content: '', mood: 'netral', note_date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      toast.error('Gagal menyimpan catatan');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`);
    toast.success('Catatan dihapus');
    fetchNotes();
  };

  return (
    <div style={{ padding: 28, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>📓 Catatan Harian</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Refleksi dan evaluasi harian kamu</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          <Plus size={16} /> Tulis Catatan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Tanggal</label>
              <input type="date" value={form.note_date} onChange={e => setForm({...form, note_date: e.target.value})}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Mood Hari Ini</label>
              <select value={form.mood} onChange={e => setForm({...form, mood: e.target.value})}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}>
                {MOODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Evaluasi Hari Ini</label>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              placeholder="Hari ini fokus saya... yang mengganggu adalah... besok saya akan..." required rows={4}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '9px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 16px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Batal</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#fff', borderRadius: 12 }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>📝</p>
            <p>Belum ada catatan. Mulai refleksi hari ini!</p>
          </div>
        ) : notes.map(note => {
          const mood = MOODS.find(m => m.value === note.mood);
          return (
            <div key={note.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>{note.note_date}</span>
                    <span style={{ background: '#f3f4f6', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, color: '#4b5563' }}>
                      {mood?.label}
                    </span>
                  </div>
                  <p style={{ color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{note.content}</p>
                </div>
                <button onClick={() => handleDelete(note.id)} style={{ padding: '6px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444', marginLeft: 12 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}