const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('goals').select('*').eq('user_id', req.user.id).eq('is_active', true);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', authMiddleware, async (req, res) => {
  const { goal_type, app_name, target_minutes, target_percentage } = req.body;
  const { data, error } = await supabaseAdmin
    .from('goals')
    .insert([{ user_id: req.user.id, goal_type, app_name, target_minutes, target_percentage }])
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('goals').update({ is_active: false }).eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Goal dihapus' });
});

module.exports = router;