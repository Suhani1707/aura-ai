const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'https://aura-ai-khaki.vercel.app'
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// ── Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/chatbot',    require('./routes/chatbot'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/sessions',   require('./routes/sessions'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/admin', require('./routes/admin'));

// ── Health check
app.get('/', (req, res) => {
  res.json({ status: '🌿 Aura backend is running!', time: new Date() });
});

// ── Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌿 Aura backend running on http://localhost:${PORT}`);
  console.log(`   Groq AI   : ${process.env.GROQ_API_KEY ? '✅ Connected' : '❌ Missing key'}`);
  console.log(`   Supabase  : ${process.env.SUPABASE_URL ? '✅ Connected' : '❌ Missing key'}\n`);
});