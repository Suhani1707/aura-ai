const express  = require('express');
const router   = express.Router();
const Groq     = require('groq-sdk');
const supabase = require('../supabase');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Crisis keywords
const CRISIS_KEYWORDS = [
  'kill myself', 'end my life', 'suicide', "don't want to live",
  'want to die', 'no reason to live', 'hurt myself', 'self harm',
  'want to disappear', 'better off dead', 'cant go on',
  'जीना नहीं', 'मरना चाहता', 'आत्महत्या', 'जगायचं नाही', 'मरायचंय',
];

function isCrisis(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(k => lower.includes(k));
}

// ── System prompt for Aura AI
const SYSTEM_PROMPT = `You are Aura, a compassionate AI mental wellness companion for college students in India. 

Your role:
- Listen empathetically and without judgment
- Provide emotional support and coping strategies
- Suggest professional help when needed
- Keep responses warm, concise (2-4 sentences), and supportive
- Never diagnose medical conditions
- Always encourage connecting with a counselor for serious issues
- Support English, Hindi, and Marathi — respond in the same language the student uses

You are NOT a replacement for professional mental health care. Always remind students that real counselors are available on the platform.`;

// ── POST /api/chatbot/message
router.post('/message', async (req, res) => {
  const { aura_id, message, language = 'en' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Crisis check
  const crisis = isCrisis(message);

  if (crisis) {
    // Save crisis event to DB
    if (aura_id) {
      try {
        await supabase.from('crisis_events').insert([{
          aura_id,
          message,
          detected_at: new Date(),
        }]);
        await supabase
          .from('students')
          .update({ flagged: true, flag_reason: 'Crisis keyword detected in chat' })
          .eq('aura_id', aura_id);
      } catch (dbErr) {
        console.error('DB error (crisis):', dbErr.message);
      }
    }

    return res.json({
      reply: `I can hear that you're going through something really painful right now. Your feelings are valid, and you deserve real support. 💙\n\nPlease connect with one of our counselors who can truly help you through this. You don't have to face this alone.\n\niCall Helpline: 9152987821`,
      isCrisis: true,
    });
  }

  // ── Call Groq API
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system',    content: SYSTEM_PROMPT },
        { role: 'user',      content: message },
      ],
      max_tokens:  300,
      temperature: 0.75,
    });

    const reply = completion.choices[0]?.message?.content || "I'm here for you. Could you tell me a little more about how you're feeling?";

    // Save message to DB
    if (aura_id) {
      try {
        await supabase.from('chat_messages').insert([{
          aura_id,
          user_message: message,
          bot_reply:    reply,
          language,
          created_at:   new Date(),
        }]);
      } catch (dbErr) {
        console.error('DB error (chat):', dbErr.message);
      }
    }

    res.json({ reply, isCrisis: false });

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'AI service unavailable', details: err.message });
  }
});

// ── GET /api/chatbot/history/:aura_id
router.get('/history/:aura_id', async (req, res) => {
  const { aura_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('aura_id', aura_id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) throw error;
    res.json({ messages: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;