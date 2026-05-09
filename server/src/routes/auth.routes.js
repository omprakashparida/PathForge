import express from 'express';
const router = express.Router();
import { handleSignup, handleLogin,getProfile,refreshAccessToken } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/profile', protect, getProfile);
router.post('/refresh-token', refreshAccessToken);
export default router;
