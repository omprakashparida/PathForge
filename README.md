# 🚀 PathForge

AI-powered personalized learning platform that helps students build structured learning journeys, generate dynamic AI roadmaps, track progress, chat with a roadmap-aware AI coach, and stay consistent with their career goals.

🌐 **Live Demo:** https://path-forge-zeta.vercel.app

---

## ✨ Features

### 🔐 Authentication System

* User signup & login with JWT (access + refresh tokens)
* OTP email verification — single-use, expiring, brute-force protected
* Resend OTP with cooldown
* Forgot password via OTP with secure reset flow
* Protected routes, secure logout, delete account

### 👤 User Profile System

* Guided onboarding (target role, skill level, daily hours, interests, timeline)
* Edit profile with smart restrictions during roadmap cooldown
* Profile–roadmap synchronization

### 🤖 AI Coach (roadmap-grounded chat)

* Conversational AI coach that reads your **actual roadmap** before every reply
* References your real phases and tasks — never invents tasks, URLs, or resources
* Politely declines off-roadmap questions and bridges back to your journey
* Persistent chat history per user (survives refresh, new tabs, and devices)
* Clear chat with two-tap confirm

### 🗺️ AI-Powered Dynamic Roadmaps

Generate personalized roadmaps from your target role, skill level, daily hours, interests, and goal timeline:

* Multi-phase structured learning paths via Groq AI
* Per-task learning resources (real links + smart search fallback)
* Task completion tracking with automatic progress updates
* 14-day regeneration cooldown to prevent abuse and quota burn
* Stored in MongoDB — progress persists across sessions

### 📚 Curated Resources Library

* Hand-picked learning resources by category
* Complements the AI-generated per-task resources

### 📊 Progress Tracking & Productivity

* Progress %, current phase, and completion status
* Daily learning streaks and points
* AI tips on the dashboard (cached + manual refresh)
* Toast notifications

### 🛡️ Security & Abuse Prevention

* Single-use expiring OTPs, 5-attempt guess limit, resend cooldowns
* Rate limiting on auth, OTP, and AI endpoints
* Security headers and separate JWT secret support
* Roadmap regeneration cooldown (14 days)

### 🎨 Forge UI

* Custom forge theme — warm charcoal, ember orange, Fraunces + Inter
* Fully responsive, mobile-first (verified down to 320px)
* Desktop sidebar rail + mobile bottom navigation
* Smart redirects — unknown URLs go to the dashboard when logged in, landing page when logged out

---

## 🛠 Tech Stack

### Frontend

* React + Vite
* Tailwind CSS v4
* React Router DOM
* Axios (with JWT refresh interceptor)
* React Hot Toast

### Backend

* Node.js + Express.js
* Mongoose (MongoDB Atlas)
* JWT auth (access + refresh), bcryptjs
* Groq SDK (`qwen/qwen3.8-27b`)
* Nodemailer (local dev) / Brevo (production email)

### Deployment

* Vercel (frontend) + Render (backend)
* GitHub — Render & Vercel auto-deploy on push

---

## 📂 Project Structure

```bash
PathForge/
├── client/
│   └── src/
│       ├── api.js            # axios instance + token refresh
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css         # forge design system
│       ├── components/       # Sidebar, UserMenu, PageLoader...
│       ├── layouts/          # DashboardLayout
│       ├── pages/            # Landing, Dashboard, Roadmap, Coach...
│       └── routes/           # AppRoutes
├── server/
│   └── src/
│       ├── server.js
│       ├── controllers/      # auth, otp, profile, roadmap, tip, coach...
│       ├── routes/
│       ├── middleware/       # auth, security (rate limit + headers)
│       ├── models/           # user, profile, roadmap, conversation...
│       └── utils/            # groq, sendEmail, generateOTP, roadmapLock
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/omprakashparida/PathForge.git
cd PathForge
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

Run frontend:

```bash
npm run dev
```

Run backend:

```bash
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret   # optional, falls back to JWT_SECRET

CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173

GROQ_API_KEY=your_groq_api_key
GROQ_ROADMAP_MODEL=qwen/qwen3.8-27b            # optional override
GROQ_COACH_MODEL=qwen/qwen3.8-27b              # optional override

# Local dev email (Gmail)
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

# Production email (Brevo)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email
```

---

## 🧠 AI Workflow

```text
User Profile (role, level, hours, timeline, interests)
        ↓
Groq AI (qwen/qwen3.8-27b)
        ↓
Dynamic Roadmap (phases → tasks → resources)
        ↓
MongoDB Storage
        ↓
Progress Tracking (completion %, streaks, points)

AI Coach (per message):
  Profile + Roadmap + Chat History → Groq → Grounded reply → MongoDB
```

---

## 🚀 Future Improvements

* Mock Interview Assistant
* Resume Analyzer
* Google / GitHub OAuth
* Achievement Badges & Leaderboards
* Daily Coding Challenges
* Community Discussions
* RAG over larger resource libraries

---

## 👨‍💻 Author

**Om Prakash Parida** — [@omprakashparida](https://github.com/omprakashparida)

Built with ❤️ using MERN Stack + AI
