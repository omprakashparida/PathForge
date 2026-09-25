// Zero-dependency security middleware (no helmet / express-rate-limit needed).

// ---------- Security headers (minimal helmet equivalent for a JSON API) ----------
export const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    // Don't advertise the stack
    res.removeHeader('X-Powered-By');
    next();
  };
  
  // ---------- Tiny in-memory rate limiter ----------
  // NOTE: counters live in this process. That's fine for a single Render
  // instance; use a shared store (e.g. express-rate-limit + Redis) if you
  // ever scale horizontally.
  export const rateLimit = ({ windowMs, max, message }) => {
    const buckets = new Map();
  
    // Lazy cleanup so the map can't grow forever
    const timer = setInterval(() => {
      const now = Date.now();
      for (const [key, bucket] of buckets) {
        if (now - bucket.start >= windowMs) buckets.delete(key);
      }
    }, windowMs);
    if (typeof timer.unref === 'function') timer.unref();
  
    return (req, res, next) => {
      const key = req.ip || req.socket?.remoteAddress || 'unknown';
      const now = Date.now();
      let bucket = buckets.get(key);
      if (!bucket || now - bucket.start >= windowMs) {
        bucket = { start: now, count: 0 };
        buckets.set(key, bucket);
      }
      bucket.count += 1;
      if (bucket.count > max) {
        return res.status(429).json({
          message: message || 'Too many requests. Please try again later.',
        });
      }
      next();
    };
  };
  
  // Login: slow down credential stuffing
  export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  });
  
  // OTP email sends: prevent OTP bombing via resend/forgot-password
  export const otpSendLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many OTP requests. Please try again in 15 minutes.',
  });
  
  // OTP verification: backstop on top of the per-code attempt cap
  export const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many verification attempts. Please try again in 15 minutes.',
  });
  