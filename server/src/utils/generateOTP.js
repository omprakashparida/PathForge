import crypto from "crypto";

// Cryptographically secure 6-digit OTP.
// Math.random() is predictable and must never be used for security codes.
export const generateOTP = () => {
  // randomInt(min, max) returns an integer in [min, max)
  return crypto.randomInt(100000, 1000000).toString();
};
