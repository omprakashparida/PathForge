import dns from 'dns';
// NOTE: overriding DNS can break in locked-down networks/VPCs. Keep only if
// your host's default resolver fails (it was added to fix DNS on Render).
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import roadmapRoutes from './routes/roadmap.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import otpRoutes from './routes/otp.routes.js';
import tipRoutes from './routes/tip.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Single CORS policy, registered once before the routes. (The old code
// registered a permissive cors() first, which silently overrode this one.)
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://pathforge-o8sl.onrender.com'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes); // OTP endpoints share the /api/auth prefix
app.use('/api/profile', profileRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tips', tipRoutes);
console.log('Dashboard route registered');

// 404 for unknown routes (JSON, not Express's default HTML)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler — catches anything controllers didn't
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({ message: 'Something went wrong' });
});

// Connect to the database FIRST, then start accepting requests.
// Previously the server listened before MongoDB was up, so early
// requests failed and a DB outage left a half-dead server running.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
