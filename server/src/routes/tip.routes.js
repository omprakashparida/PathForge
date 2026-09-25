import express from "express";
import { getTip } from "../controllers/tip.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// AI daily tip, proxied so the Groq key stays server-side.
router.post("/", protect, getTip);

export default router;
