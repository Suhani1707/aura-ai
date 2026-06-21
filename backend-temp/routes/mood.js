const express  = require('express');
const router   = express.Router();
const supabase = require('../supabase');

// ── POST /api/mood/save
router.post('/save', async (req, res) => {
  const { aura_id, date, value, label, emoji, note, time } = req.body;

  if (!aura_id || !date || !value) {
    return res.status(400).json({ error: 'aura_id, date and value are required' });
  }

  try {
    // Upsert — update if exists for today, insert if not
    const { data, error } = await supabase
      .from('mood_logs')
      .upsert([{ aura_id, date, value, label, emoji, note: note || '', time, logged_at: new Date() }],
              { onConflict: 'aura_id,date' })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, entry: data });
  } catch (err) {
    console.error('Mood save error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/mood/:aura_id
router.get('/:aura_id', async (req, res) => {
  const { aura_id } = req.params;
  try {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('aura_id', aura_id)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;
    res.json({ logs: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;