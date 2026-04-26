import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bell, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    const { data } = await api.get('/notifications');
    setNotifs(data);
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifs();
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  return (
    <div style={{ padding: 28, maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={24} /> Notifikasi
          {unreadCount > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 14 }}>{unreadCount}</span>}
        </h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Pesan dan pengumuman dari admin</p>
      </div>

      {notifs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#fff', borderRadius: 12 }}>
          <Bell size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p>Tidak ada notifikasi</p>
        </div>
      ) : notifs.map(n => (
        <div key={n.id} style={{
          background: n.is_read ? '#fff' : '#eff6ff', borderRadius: 12, padding: 16,
          marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          borderLeft: `4px solid ${n.is_read ? '#e5e7eb' : '#2563eb'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>{n.notifications?.title}</h3>
              <p style={{ color: '#374151', fontSize: 14 }}>{n.notifications?.message}</p>
              <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 6 }}>
                {new Date(n.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {!n.is_read && (
              <button onClick={() => markRead(n.id)}
                style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 12 }}>
                <CheckCheck size={14} /> Tandai Dibaca
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}