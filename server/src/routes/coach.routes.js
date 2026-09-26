import express from "express";
import { chat, getHistory, clearHistory } from "../controllers/coach.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { rateLimit } from "../middleware/security.middleware.js";

const router = express.Router();

// 20 chat messages/minute per IP — the shared Groq quota is the real
// bottleneck, so per-user quotas get tightened here first if needed.
const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  message: "Too many messages. Slow down a little.",
});

// AI coach chat, proxied so the Groq key stays server-side.
router.post("/", protect, chatLimiter, chat);
router.get("/history", protect, getHistory);
router.delete("/history", protect, clearHistory);

export default router;
