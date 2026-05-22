import express from 'express';
import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getDashboardSummary);

export default router;