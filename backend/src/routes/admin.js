const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { adminMiddleware } = require('../middleware/auth');

// DASHBOARD ADMIN
router.get('/dashboard', adminMiddleware, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const { data: users } = await supabaseAdmin.from('profiles').select('id, is_active');
  const { data: todayActivities } = await supabaseAdmin
    .from('activities').select('user_id, duration_minutes, category').eq('activity_date', today);
  const { data: warnings } = await supabaseAdmin
    .from('warning_logs').select('user_id').eq('activity_date', today);

  // User aktif hari ini
  const activeToday = [...new Set(todayActivities?.map(a => a.user_id))].length;

  // Rata-rata focus score
  const userScores = {};
  todayActivities?.forEach(a => {
    if (!userScores[a.user_id]) userScores[a.user_id] = { total: 0, produktif: 0 };
    userScores[a.user_id].total += a.duration_minutes;
    if (a.category === 'produktif') userScores[a.user_id].produktif += a.duration_minutes;
  });
  const scores = Object.values(userScores).map(u => u.total > 0 ? (u.produktif / u.total) * 100 : 0);
  const avgFocusScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  res.json({
    totalUsers: users?.length || 0,
    activeUsers: activeToday,
    avgFocusScore,
    warningCount: warnings?.length || 0
  });
});

// DAFTAR USER
router.get('/users', adminMiddleware, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// EDIT USER
router.put('/users/:id', adminMiddleware, async (req, res) => {
  const { nama, email, is_active } = req.body;
  const { data, error } = await supabaseAdmin
    .from('profiles').update({ nama, email, is_active }).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// HAPUS USER
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User dihapus' });
});

// MONITORING AKTIVITAS SEMUA USER
router.get('/activities', adminMiddleware, async (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data } = await supabaseAdmin
    .from('activities').select('*, profiles(nama, email)')
    .eq('activity_date', targetDate);

  res.json(data);
});

// KIRIM NOTIFIKASI MASSAL
router.post('/notifications', adminMiddleware, async (req, res) => {
  const { title, message, target } = req.body;

  // Simpan notifikasi
  const { data: notif } = await supabaseAdmin
    .from('notifications').insert([{ title, message, target, sent_by: req.user.id }])
    .select().single();

  // Kirim ke user
  let usersQuery = supabaseAdmin.from('profiles').select('id').eq('role', 'user');

  if (target === 'warning_users') {
    const today = new Date().toISOString().split('T')[0];
    const { data: warnUsers } = await supabaseAdmin
      .from('warning_logs').select('user_id').eq('activity_date', today);
    const warnIds = [...new Set(warnUsers?.map(w => w.user_id))];
    usersQuery = supabaseAdmin.from('profiles').select('id').in('id', warnIds);
  }

  const { data: users } = await usersQuery;
  const userNotifs = users?.map(u => ({ user_id: u.id, notification_id: notif.id })) || [];

  if (userNotifs.length > 0) {
    await supabaseAdmin.from('user_notifications').insert(userNotifs);
  }

  res.json({ message: `Notifikasi dikirim ke ${userNotifs.length} user`, notification: notif });
});

// KELOLA KATEGORI APLIKASI
router.get('/categories', adminMiddleware, async (req, res) => {
  const { data } = await supabaseAdmin.from('app_categories').select('*').order('app_name');
  res.json(data);
});

router.post('/categories', adminMiddleware, async (req, res) => {
  const { app_name, category } = req.body;
  const { data, error } = await supabaseAdmin
    .from('app_categories').insert([{ app_name, category, created_by: req.user.id }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.put('/categories/:id', adminMiddleware, async (req, res) => {
  const { app_name, category } = req.body;
  const { data, error } = await supabaseAdmin
    .from('app_categories').update({ app_name, category }).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/categories/:id', adminMiddleware, async (req, res) => {
  const { error } = await supabaseAdmin.from('app_categories').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Kategori dihapus' });
});

// LAPORAN GLOBAL
router.get('/reports', adminMiddleware, async (req, res) => {
  const { start_date, end_date } = req.query;
  const start = start_date || new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const end = end_date || new Date().toISOString().split('T')[0];

  const { data } = await supabaseAdmin
    .from('activities').select('*, profiles(nama)')
    .gte('activity_date', start).lte('activity_date', end);

  // Group by user
  const userMap = {};
  data?.forEach(a => {
    if (!userMap[a.user_id]) userMap[a.user_id] = { nama: a.profiles?.nama, total: 0, produktif: 0, distraksi: 0 };
    userMap[a.user_id].total += a.duration_minutes;
    if (a.category === 'produktif') userMap[a.user_id].produktif += a.duration_minutes;
    if (a.category === 'hiburan') userMap[a.user_id].distraksi += a.duration_minutes;
  });

  const report = Object.entries(userMap).map(([id, u]) => ({
    user_id: id,
    nama: u.nama,
    total_menit: u.total,
    produktif_menit: u.produktif,
    distraksi_menit: u.distraksi,
    focus_score: u.total > 0 ? Math.round((u.produktif / u.total) * 100) : 0
  }));

  res.json(report);
});

// WARNING USERS
router.get('/warnings', adminMiddleware, async (req, res) => {
  const { data } = await supabaseAdmin
    .from('warning_logs').select('*, profiles(nama, email)')
    .order('created_at', { ascending: false });
  res.json(data);
});

module.exports = router;