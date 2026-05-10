import express from 'express';
import { generateRoadmap } from '../controllers/roadmap.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { getRoadmap } from '../controllers/roadmap.controller.js';
import {markTaskComplete} from '../controllers/roadmap.controller.js';
const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.put('/complete-task', protect, markTaskComplete);

export default router;