# 🚀 PathForge

AI-powered personalized learning platform that helps students build structured learning journeys, generate dynamic AI roadmaps, track progress, and stay consistent with their career goals.

🌐 **Live Demo:** https://path-forge-zeta.vercel.app

---

## ✨ Features

### 🔐 Authentication System

* User Signup & Login
* JWT Authentication
* Protected Routes
* Secure Logout
* Delete Account functionality
* OTP Email Verification
* Resend OTP with cooldown
* Forgot Password via OTP
* Secure Password Reset Flow

---

### 👤 User Profile System

* Create Profile
* Edit Profile
* Personalized onboarding flow
* Career preference selection
* Profile-roadmap synchronization
* Smart profile update restrictions during roadmap cooldown period

---

### 🤖 AI-Powered Dynamic Roadmaps

Generate personalized AI roadmaps based on:

* Target Role
* Current Skill Level
* Daily Available Hours
* Interests
* Goal Timeline

Features:

* Dynamic roadmap generation using Groq AI
* Multi-phase structured learning paths
* Personalized task recommendations
* Roadmap storage in MongoDB
* AI-generated roadmap persistence

---

### 📊 Progress Tracking

* Progress percentage calculation
* Task completion tracking
* Current learning phase tracking
* Roadmap completion status
* Automatic progress updates

---

### 🔥 Productivity Features

* AI Tips section
* Daily learning streak system
* Interactive roadmap progress
* Personalized dashboard

---

### 🛡 Smart Abuse Prevention

* Roadmap regeneration cooldown (14 days)
* Prevent repeated AI roadmap generation
* Prevent profile-roadmap data mismatch
* Restrict roadmap-related profile changes during cooldown period

---

### 🎨 Modern UI/UX

* Fully responsive design
* Dark premium theme
* Glassmorphism UI
* Animated components
* Toast notifications
* Smooth transitions
* Mobile-friendly layouts

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* React Hot Toast

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MongoDB Atlas
* Mongoose

### AI Integration

* Groq API
* Llama Model

### Email Service

* Nodemailer (Local Development)
* Brevo (Production)

### Deployment

* Vercel
* GitHub

---

## 📂 Project Structure

```bash
PathForge/

├── client/
│
│ ├── components/
│ ├── pages/
│ ├── layouts/
│ ├── services/
│ └── App.jsx
│
├── server/
│
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── models/
│ ├── utils/
│ └── config/
│
└── README.md
```

---

## ⚙ Installation

Clone repository:

```bash
git clone https://github.com/omprakashparida/PathForge.git
```

Move to project:

```bash
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

Create a `.env` file inside server:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key

EMAIL_USER=your_email

EMAIL_PASS=your_password

BREVO_API_KEY=your_brevo_api_key

BREVO_SENDER_EMAIL=your_email
```

---

## 🧠 AI Workflow

```text
User Profile
        ↓
Target Role
Skill Level
Daily Hours
Timeline
Interests
        ↓
Groq AI
        ↓
Dynamic Roadmap Generation
        ↓
MongoDB Storage
        ↓
Progress Tracking
```

---

## 🚀 Future Improvements

* AI-generated learning resources
* Resume Analyzer
* Mock Interview Assistant
* Achievement Badges
* Google Authentication
* GitHub Authentication
* Daily Coding Challenges
* Leaderboards
* Community Discussions

---

## 👨‍💻 Author

**Om Prakash Parida**

Built with ❤️ using MERN Stack + AI