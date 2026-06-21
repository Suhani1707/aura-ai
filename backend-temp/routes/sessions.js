const express  = require('express');
const router   = express.Router();
const supabase = require('../supabase');

// ── POST /api/sessions/book
router.post('/book', async (req, res) => {
  const { aura_id, counselor_id, date, time, type, urgent } = req.body;

  if (!aura_id || !counselor_id || !date || !time || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        aura_id,
        counselor_id,
        date,
        time,
        type,
        urgent:    urgent || false,
        status:    'upcoming',
        booked_at: new Date(),
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, session: data });
  } catch (err) {
    console.error('Book session error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/sessions/student/:aura_id
router.get('/student/:aura_id', async (req, res) => {
  const { aura_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('aura_id', aura_id)
      .order('booked_at', { ascending: false });

    if (error) throw error;
    res.json({ sessions: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/sessions/counselor/:counselor_id
router.get('/counselor/:counselor_id', async (req, res) => {
  const { counselor_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('counselor_id', counselor_id)
      .order('date', { ascending: true });

    if (error) throw error;
    res.json({ sessions: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/sessions/:id/status
// Update session status: upcoming → completed / cancelled
router.patch('/:id/status', async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body; // 'completed' or 'cancelled'

  try {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, session: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/sessions/all  (for admin)
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('booked_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json({ sessions: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;