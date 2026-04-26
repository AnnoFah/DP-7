import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Activity, Target, Timer,
  BarChart2, BookOpen, Bell, LogOut,
  Users, Tag, Send, ShieldAlert, UserCircle
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.profile?.role === 'admin';
  const nama = user?.profile?.nama || 'User';
  const email = user?.profile?.email || '';

  const userLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/activities', icon: <Activity size={18} />, label: 'Aktivitas' },
    { to: '/focus-mode', icon: <Timer size={18} />, label: 'Mode Fokus' },
    { to: '/goals', icon: <Target size={18} />, label: 'Target' },
    { to: '/reports', icon: <BarChart2 size={18} />, label: 'Laporan' },
    { to: '/notes', icon: <BookOpen size={18} />, label: 'Catatan' },
    { to: '/notifications', icon: <Bell size={18} />, label: 'Notifikasi' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard Admin' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Manajemen User' },
    { to: '/admin/categories', icon: <Tag size={18} />, label: 'Kategori App' },
    { to: '/admin/notifications', icon: <Send size={18} />, label: 'Kirim Notifikasi' },
    { to: '/admin/reports', icon: <BarChart2 size={18} />, label: 'Laporan Global' },
    { to: '/admin/warnings', icon: <ShieldAlert size={18} />, label: 'Warning Users' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Ambil inisial nama untuk avatar
  const initials = nama
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside style={{
      width: '220px',
      background: '#1e1b4b',
      color: '#fff',
      height: '100vh',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* LOGO */}
      <div style={{
        padding: '20px 20px',
        borderBottom: '1px solid #312e81',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#a5b4fc' }}>
          🎯 FocusMonitor
        </h2>
        <p style={{ fontSize: '11px', color: '#7c3aed', marginTop: 3 }}>
          {isAdmin ? '👨‍💼 Admin Panel' : '🎯 Productivity Tracker'}
        </p>
      </div>

      {/* PROFILE CARD */}
      <div
        onClick={() => navigate('/profile')}
        style={{
          margin: '12px',
          background: '#312e81',
          borderRadius: 10,
          padding: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid rgba(165,180,252,0.15)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#3730a3'}
        onMouseLeave={e => e.currentTarget.style.background = '#312e81'}
      >
        {/* Avatar */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        {/* Info */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#e0e7ff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {nama}
          </p>
          <p style={{
            fontSize: 10,
            color: '#a5b4fc',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {email}
          </p>
        </div>
        {/* Icon */}
        <UserCircle size={14} color="#a5b4fc" style={{ flexShrink: 0 }} />
      </div>

      {/* NAVIGATION LINKS */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <p style={{
          fontSize: 10,
          color: '#6d28d9',
          padding: '8px 20px 4px',
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
          Menu
        </p>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 20px',
              fontSize: '13px',
              textDecoration: 'none',
              color: isActive ? '#a5b4fc' : '#c4b5fd',
              background: isActive ? '#312e81' : 'transparent',
              borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.2s',
            })}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM: Profile link + Logout */}
      <div style={{ borderTop: '1px solid #312e81' }}>
        {/* Tombol Profile */}
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#a5b4fc',
            fontSize: '13px',
            textAlign: 'left',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#312e81'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <UserCircle size={16} /> Edit Profil
        </button>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#f87171',
            fontSize: '13px',
            textAlign: 'left',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#3f1c1c'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

    </aside>
  );
}