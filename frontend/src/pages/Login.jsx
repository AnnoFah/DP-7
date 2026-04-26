import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Login berhasil!');
      navigate(user.profile?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 40, width: 380,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#1e1b4b', marginBottom: 8 }}>🎯 FocusMonitor</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 32, fontSize: 14 }}>
          Pantau fokus dan screen time kamu
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>Email</label>
            <input
              type="email" value={form.email} placeholder="email@example.com"
              onChange={e => setForm({...form, email: e.target.value})} required
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>Password</label>
            <input
              type="password" value={form.password} placeholder="••••••••"
              onChange={e => setForm({...form, password: e.target.value})} required
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: 12, background: '#4f46e5', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Belum punya akun? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>Daftar</Link>
        </p>
      </div>
    </div>
  );
}