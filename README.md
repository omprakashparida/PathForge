# 🚀 PathForge

AI-powered personalized learning platform that helps students build structured learning journeys, track progress, and stay consistent with their career goals.

🌐 **Live Demo:** https://path-forge-zeta.vercel.app

---

## ✨ Features

### 🔐 Authentication

* User Signup & Login
* JWT Authentication
* Protected Routes
* Secure Logout
* Delete Account functionality

### 👤 User Profile System

* Create Profile
* Edit Profile
* Personalized onboarding flow
* Career preference selection

### 🗺 Personalized Roadmaps

* Generate learning roadmaps based on:

  * Target Role
  * Skill Level
  * Interests
  * Timeline
* Multi-phase roadmap structure
* Task completion tracking

### 📊 Progress Tracking

* Progress percentage
* Completed task tracking
* Current learning phase
* Next task recommendations

### 🔥 Productivity Features

* AI Tips section
* Streak tracking system
* Responsive Dashboard
* Interactive roadmap progress

### 🎨 Modern UI/UX

* Fully responsive design
* Dark premium theme
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

### Database

* MongoDB Atlas

### Deployment

* Vercel

---

## 📂 Project Structure

PathForge/

├── client/

│ ├── components/

│ ├── pages/

│ ├── layouts/

│ └── services/

│

├── server/

│ ├── controllers/

│ ├── routes/

│ ├── middleware/

│ ├── models/

│ └── config/

│

└── README.md

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

Create a `.env` file in server:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

VITE_GROQ_API_KEY=your_key
```

---

## 🚀 Future Improvements

* OTP-based Authentication
* Forgot Password via OTP
* Dynamic AI Roadmaps
* Achievement Badges
* Real Daily Streak System
* Google Authentication
* GitHub Authentication

---

## 👨‍💻 Author

Om Prakash Parida

Built with ❤️ using MERN Stack
