import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    // bcrypt hash of the OTP — the plaintext code is never stored,
    // so a database read can never reveal active codes.
    otp: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    purpose: {
      type: String,
      default: "signup",
    },

    // Forgot-password flow: set to true by verifyForgotOTP after a correct
    // code. resetPassword refuses to run without this flag, so the password
    // cannot be reset without proving ownership of the email.
    verified: {
      type: Boolean,
      default: false,
    },

    // Failed verification attempts. The document is discarded after too
    // many wrong guesses, which makes brute-forcing a 6-digit code infeasible.
    attempts: {
      type: Number,
      default: 0,
    },

    // ==========================
    // Resend attempts
    // ==========================

    resendCount: {
      type: Number,
      default: 0,
    },

    nextResendTime: {
      type: Date,
      default: Date.now,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired OTP documents. Combined with deletion-on-use,
// every OTP is strictly single-use and time-boxed.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
