import express from 'express';
const router = express.Router();
import { handleLogin, getProfile, refreshAccessToken, handleLogout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// NOTE: the direct POST /signup endpoint was removed on purpose — it created
// accounts without email verification, which made the whole OTP flow optional.
// Signups now go through /api/auth/send-signup-otp + /verify-signup-otp.
router.post('/login', handleLogin);
router.get('/profile', protect, getProfile);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', handleLogout);
export default router;
