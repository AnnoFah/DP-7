const { supabase } = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }

  req.user = user;
  req.token = token;
  next();
};

const adminMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, async () => {
    const { supabaseAdmin } = require('../config/supabase');
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak. Admin only.' });
    }
    next();
  });
};

module.exports = { authMiddleware, adminMiddleware };