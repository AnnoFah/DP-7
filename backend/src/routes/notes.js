const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('daily_notes').select('*').eq('user_id', req.user.id)
    .order('note_date', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', authMiddleware, async (req, res) => {
  const { content, mood, note_date } = req.body;
  const { data, error } = await supabaseAdmin
    .from('daily_notes')
    .insert([{ user_id: req.user.id, content, mood, note_date: note_date || new Date().toISOString().split('T')[0] }])
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { content, mood } = req.body;
  const { data, error } = await supabaseAdmin
    .from('daily_notes').update({ content, mood }).eq('id', req.params.id).eq('user_id', req.user.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('daily_notes').delete().eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Catatan dihapus' });
});

module.exports = router;