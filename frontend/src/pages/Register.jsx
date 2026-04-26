import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ nama: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return toast.error('Password tidak cocok!');
    if (form.password.length < 6)
      return toast.error('Password minimal 6 karakter');
    setLoading(true);
    try {
      await api.post('/auth/register', { nama: form.nama, email: form.email, password: form.password });
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h1 style={{ textAlign: 'center', color: '#1e1b4b', marginBottom: 8 }}>📝 Daftar Akun</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 28, fontSize: 14 }}>Mulai perjalanan fokusmu</p>
        <form onSubmit={handleSubmit}>
          {[
            { key: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama kamu' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { key: 'confirmPassword', label: 'Konfirmasi Password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>{field.label}</label>
              <input
                type={field.type} value={form[field.key]} placeholder={field.placeholder}
                onChange={e => setForm({...form, [field.key]: e.target.value})} required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Sudah punya akun? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}