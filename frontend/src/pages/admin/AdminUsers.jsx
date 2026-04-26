import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Search, UserX, UserCheck, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  const toggleActive = async (id, current) => {
    await api.put(`/admin/users/${id}`, { is_active: !current });
    toast.success(!current ? 'Akun diaktifkan' : 'Akun dinonaktifkan');
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm('Yakin hapus user ini?')) return;
    await api.delete(`/admin/users/${id}`);
    toast.success('User dihapus');
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.nama?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', marginBottom: 24 }}>👥 Manajemen User</h1>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Search size={18} color="#9ca3af" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau email..."
            style={{ border: 'none', outline: 'none', fontSize: 14, flex: 1 }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Nama', 'Email', 'Role', 'Status', 'Bergabung', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e1b4b' }}>{u.nama}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: u.role === 'admin' ? '#7c3aed20' : '#2563eb20', color: u.role === 'admin' ? '#7c3aed' : '#2563eb', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: u.is_active ? '#10b98120' : '#ef444420', color: u.is_active ? '#10b981' : '#ef4444', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {u.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>
                  {new Date(u.created_at).toLocaleDateString('id-ID')}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleActive(u.id, u.is_active)}
                      style={{ padding: '6px 10px', background: u.is_active ? '#fef2f2' : '#f0fdf4', border: 'none', borderRadius: 6, cursor: 'pointer', color: u.is_active ? '#ef4444' : '#10b981' }}>
                      {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)}
                        style={{ padding: '6px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
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