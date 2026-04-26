import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { UserCircle, Mail, Shield, Calendar, Save, KeyRound } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formProfile, setFormProfile] = useState({ nama: '', email: '' });
  const [formPassword, setFormPassword] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    const { data } = await api.get('/auth/profile');
    setProfile(data);
    setFormProfile({ nama: data.nama, email: data.email });
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/activities/focus-score');
      setStats(data);
    } catch {}
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      // Update profile di Supabase via endpoint
      await api.put('/auth/profile', {
        nama: formProfile.nama,
        email: formProfile.email,
      });
      toast.success('Profil berhasil diperbarui!');
      fetchProfile();

      // Update localStorage
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      savedUser.profile = { ...savedUser.profile, ...formProfile };
      localStorage.setItem('user', JSON.stringify(savedUser));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal memperbarui profil');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formPassword.newPassword !== formPassword.confirmPassword) {
      return toast.error('Password tidak cocok!');
    }
    if (formPassword.newPassword.length < 6) {
      return toast.error('Password minimal 6 karakter');
    }
    setLoadingPassword(true);
    try {
      await api.put('/auth/change-password', {
        newPassword: formPassword.newPassword,
      });
      toast.success('Password berhasil diubah!');
      setFormPassword({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal mengubah password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const initials = profile?.nama
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  };

  return (
    <div style={{ padding: 28, maxWidth: 700, margin: '0 auto' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b' }}>
          👤 Profil Saya
        </h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>
          Kelola informasi akun dan keamanan
        </p>
      </div>

      {/* PROFILE HEADER CARD */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: 16,
        padding: 28,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Avatar besar */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#6366f1',
          border: '3px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 800,
          color: '#fff',
          flexShrink: 0,
        }}>
          {initials}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {profile?.nama || '...'}
          </h2>
          <p style={{ color: '#a5b4fc', fontSize: 14, marginBottom: 8 }}>
            {profile?.email || '...'}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(99,102,241,0.3)',
              border: '1px solid rgba(165,180,252,0.3)',
              color: '#a5b4fc',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <Shield size={12} />
              {profile?.role === 'admin' ? 'Administrator' : 'User'}
            </span>
            <span style={{
              background: profile?.is_active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
              border: `1px solid ${profile?.is_active ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: profile?.is_active ? '#6ee7b7' : '#fca5a5',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {profile?.is_active ? '● Aktif' : '● Nonaktif'}
            </span>
          </div>
        </div>

        {/* Stat hari ini */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '16px 20px',
          textAlign: 'center',
          minWidth: 120,
        }}>
          <p style={{ fontSize: 11, color: '#a5b4fc', marginBottom: 4 }}>
            Focus Score Hari Ini
          </p>
          <p style={{
            fontSize: 36,
            fontWeight: 800,
            color: stats?.focusScore >= 70 ? '#34d399' : stats?.focusScore >= 40 ? '#fbbf24' : '#f87171',
          }}>
            {stats?.focusScore ?? '—'}
            <span style={{ fontSize: 18 }}>%</span>
          </p>
        </div>
      </div>

      {/* INFO CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          {
            icon: <Mail size={16} color="#6366f1" />,
            label: 'Email',
            value: profile?.email || '—',
          },
          {
            icon: <Calendar size={16} color="#10b981" />,
            label: 'Bergabung Sejak',
            value: profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })
              : '—',
          },
          {
            icon: <UserCircle size={16} color="#f59e0b" />,
            label: 'Total Screen Time',
            value: stats ? `${Math.round(stats.totalMenit / 60 * 10) / 10} jam` : '—',
          },
        ].map(item => (
          <div key={item.label} style={{
            background: '#fff',
            borderRadius: 10,
            padding: '14px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              {item.icon}
              <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>{item.label}</span>
            </div>
            <p style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1e1b4b',
              wordBreak: 'break-all',
            }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* FORM EDIT PROFIL */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#1e1b4b',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <UserCircle size={18} color="#6366f1" /> Edit Informasi Profil
        </h3>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Nama Lengkap</label>
              <input
                type="text"
                value={formProfile.nama}
                onChange={e => setFormProfile({ ...formProfile, nama: e.target.value })}
                required
                style={inputStyle}
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={formProfile.email}
                onChange={e => setFormProfile({ ...formProfile, email: e.target.value })}
                required
                style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }}
                placeholder="email@example.com"
                disabled
              />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                * Email tidak dapat diubah
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              background: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loadingProfile ? 'not-allowed' : 'pointer',
              opacity: loadingProfile ? 0.7 : 1,
            }}
          >
            <Save size={16} />
            {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      {/* FORM GANTI PASSWORD */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#1e1b4b',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <KeyRound size={18} color="#f59e0b" /> Ganti Password
        </h3>

        <form onSubmit={handleChangePassword}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Password Baru</label>
              <input
                type="password"
                value={formPassword.newPassword}
                onChange={e => setFormPassword({ ...formPassword, newPassword: e.target.value })}
                required
                style={inputStyle}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div>
              <label style={labelStyle}>Konfirmasi Password</label>
              <input
                type="password"
                value={formPassword.confirmPassword}
                onChange={e => setFormPassword({ ...formPassword, confirmPassword: e.target.value })}
                required
                style={inputStyle}
                placeholder="Ulangi password baru"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingPassword}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              background: '#f59e0b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loadingPassword ? 'not-allowed' : 'pointer',
              opacity: loadingPassword ? 0.7 : 1,
            }}
          >
            <KeyRound size={16} />
            {loadingPassword ? 'Memproses...' : 'Ganti Password'}
          </button>
        </form>
      </div>

    </div>
  );
}