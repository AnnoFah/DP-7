const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET semua aktivitas user (filter by date)
router.get('/', authMiddleware, async (req, res) => {
  const { date, start_date, end_date } = req.query;
  let query = supabaseAdmin
    .from('activities')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (date) query = query.eq('activity_date', date);
  if (start_date && end_date) query = query.gte('activity_date', start_date).lte('activity_date', end_date);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// TAMBAH AKTIVITAS
router.post('/', authMiddleware, async (req, res) => {
  const { app_name, duration_minutes, activity_date } = req.body;

  // Cek kategori otomatis
  const { data: catData } = await supabaseAdmin
    .from('app_categories')
    .select('category')
    .ilike('app_name', app_name)
    .single();

  const category = catData?.category || 'lainnya';

  const { data, error } = await supabaseAdmin
    .from('activities')
    .insert([{
      user_id: req.user.id,
      app_name,
      duration_minutes,
      category,
      activity_date: activity_date || new Date().toISOString().split('T')[0]
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Cek warning (jika distraksi > 360 menit = 6 jam dalam sehari)
  const { data: todayDistraction } = await supabaseAdmin
    .from('activities')
    .select('duration_minutes')
    .eq('user_id', req.user.id)
    .eq('category', 'hiburan')
    .eq('activity_date', activity_date || new Date().toISOString().split('T')[0]);

  const totalDistraction = todayDistraction?.reduce((sum, a) => sum + a.duration_minutes, 0) || 0;
  if (totalDistraction >= 360) {
    await supabaseAdmin.from('warning_logs').insert([{
      user_id: req.user.id,
      reason: `Total distraksi ${totalDistraction} menit pada tanggal ${activity_date || 'hari ini'}`,
      activity_date: activity_date || new Date().toISOString().split('T')[0]
    }]);
  }

  res.json(data);
});

// UPDATE AKTIVITAS
router.put('/:id', authMiddleware, async (req, res) => {
  const { app_name, duration_minutes, activity_date } = req.body;

  const catData = await supabaseAdmin
    .from('app_categories').select('category').ilike('app_name', app_name).single();
  const category = catData?.data?.category || 'lainnya';

  const { data, error } = await supabaseAdmin
    .from('activities')
    .update({ app_name, duration_minutes, category, activity_date })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// HAPUS AKTIVITAS
router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('activities')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Aktivitas dihapus' });
});

// FOCUS SCORE hari ini
router.get('/focus-score', authMiddleware, async (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data } = await supabaseAdmin
    .from('activities')
    .select('duration_minutes, category')
    .eq('user_id', req.user.id)
    .eq('activity_date', targetDate);

  const totalMenit = data?.reduce((s, a) => s + a.duration_minutes, 0) || 0;
  const produktif = data?.filter(a => a.category === 'produktif').reduce((s, a) => s + a.duration_minutes, 0) || 0;
  const distraksi = data?.filter(a => a.category === 'hiburan').reduce((s, a) => s + a.duration_minutes, 0) || 0;
  const focusScore = totalMenit > 0 ? Math.round((produktif / totalMenit) * 100) : 0;

  res.json({ totalMenit, produktif, distraksi, focusScore, date: targetDate });
});

module.exports = router;