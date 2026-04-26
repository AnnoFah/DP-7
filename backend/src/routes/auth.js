const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// REGISTER
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password)
    return res.status(400).json({ error: 'Semua field wajib diisi' });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nama, role: 'user' }
    }
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Registrasi berhasil! Cek email untuk verifikasi.', user: data.user });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: 'Email atau password salah' });

  // Ambil profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profile && !profile.is_active)
    return res.status(403).json({ error: 'Akun dinonaktifkan oleh admin' });

  res.json({
    token: data.session.access_token,
    user: { ...data.user, profile }
  });
});

// LOGOUT
router.post('/logout', authMiddleware, async (req, res) => {
  await supabase.auth.signOut();
  res.json({ message: 'Logout berhasil' });
});

// GET PROFILE
router.get('/profile', authMiddleware, async (req, res) => {
  const { supabaseAdmin } = require('../config/supabase');
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// UPDATE PROFILE
router.put('/profile', authMiddleware, async (req, res) => {
  const { nama } = req.body;
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ nama })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GANTI PASSWORD
router.put('/change-password', authMiddleware, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'Password minimal 6 karakter' });

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    req.user.id,
    { password: newPassword }
  );

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Password berhasil diubah' });
});

module.exports = router;