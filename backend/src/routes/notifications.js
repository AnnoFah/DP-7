const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// User: lihat notifikasi sendiri
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('user_notifications')
    .select('*, notifications(*)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Tandai sudah dibaca
router.put('/:id/read', authMiddleware, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('user_notifications')
    .update({ is_read: true })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Notifikasi ditandai dibaca' });
});

module.exports = router;