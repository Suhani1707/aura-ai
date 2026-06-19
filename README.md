# Aura AI 🌿

Aura AI is a student mental wellness platform that connects students, counselors, and administrators in one place. It combines guided self-help tools, peer community, mood tracking, and direct access to counselors to support student mental health.

## Features

- **Student Dashboard** — central hub for all wellness tools
- **Self-Assessment** — guided check-ins to help students reflect on how they're feeling
- **Mood Tracker** — log and visualize mood over time
- **AI Chat Support** — conversational support for students
- **Wellness Games** — interactive breathing, memory, and bubble-pop games designed to ease stress and anxiety
- **Guided Audio** — breathing, meditation, and nature soundscapes
- **Community** — peer space for students to connect and share
- **Counselor Booking** — students can reach out to counselors directly
- **Counselor Dashboard** — counselors can manage and respond to student requests
- **Admin Dashboard** — oversight and management tools for administrators

## Tech Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express
- **Database / Auth:** [Supabase](https://supabase.com) (PostgreSQL, Auth)
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Project Structure

\`\`\`
aura-project/
├── backend/
│   ├── routes/          # auth, mood, sessions, chatbot, admin, assessment
│   ├── middleware/       # auth middleware
│   ├── supabase.js       # Supabase client setup
│   └── server.js         # Express entry point
├── public/
│   └── audios/            # breathing, meditation, nature sounds
└── src/
    ├── pages/
    │   ├── Login.jsx
    │   ├── student/        # Dashboard, Assessment, Chat, Resources, Community, Games, MoodTracker
    │   ├── counselor/      # Counselor dashboard & login
    │   └── admin/          # Admin dashboard
    ├── components/         # Shared and role-specific components
    ├── context/             # App-wide context providers
    └── i18n/                # Localization
\`\`\`

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm
- A Supabase project (free tier works)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Suhani1707/aura-ai.git
cd aura-ai
\`\`\`

### 2. Set up the frontend
\`\`\`bash
npm install
\`\`\`

Create a \`.env\` file in the root directory:
\`\`\`
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

Run the frontend:
\`\`\`bash
npm start
\`\`\`
Runs at \`http://localhost:3000\`.

### 3. Set up the backend
\`\`\`bash
cd backend
npm install
\`\`\`

Create a \`.env\` file inside \`backend/\`:
\`\`\`
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_or_anon_key
PORT=5000
\`\`\`

Run the backend:
\`\`\`bash
node server.js
\`\`\`

## Roadmap

- [ ] Real-time chat
- [ ] Push notifications for counselor responses
- [ ] Deployed live demo

## License

This project is for educational purposes.