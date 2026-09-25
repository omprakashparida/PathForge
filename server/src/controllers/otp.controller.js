import bcrypt from "bcryptjs";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTP } from "../utils/sendEmail.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

const isExpired = (doc) => new Date() > doc.expiresAt;

// Creates a fresh OTP document. The plaintext code is hashed before storage
// and only lives long enough to be emailed — the DB never sees it.
const createOTPDoc = async ({ email, name, password, purpose }) => {
  const otp = generateOTP();
  await OTP.deleteMany({ email, purpose });
  await OTP.create({
    email,
    name,
    password,
    otp: await bcrypt.hash(otp, 10),
    purpose,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });
  return otp;
};

// Validates a submitted code. Returns null when valid, otherwise a
// client-safe error message. Wrong guesses are counted and the document
// is discarded after too many attempts or on expiry (single-use by design).
const validateOTP = async (otpData, otp) => {
  if (!otpData) {
    return "OTP not found or expired. Please request a new one.";
  }
  if (isExpired(otpData)) {
    await OTP.deleteOne({ _id: otpData._id });
    return "OTP expired. Please request a new one.";
  }
  if (otpData.attempts >= MAX_VERIFY_ATTEMPTS) {
    await OTP.deleteOne({ _id: otpData._id });
    return "Too many attempts. Please request a new OTP.";
  }
  const match = await bcrypt.compare(otp, otpData.otp);
  if (!match) {
    otpData.attempts += 1;
    if (otpData.attempts >= MAX_VERIFY_ATTEMPTS) {
      await OTP.deleteOne({ _id: otpData._id });
      return "Too many attempts. Please request a new OTP.";
    }
    await otpData.save();
    return `Invalid OTP. ${MAX_VERIFY_ATTEMPTS - otpData.attempts} attempts left.`;
  }
  return null;
};

// ==========================
// Send Signup OTP
// ==========================

export const sendSignupOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = await createOTPDoc({
      email,
      name,
      password: hashedPassword,
      purpose: "signup",
    });

    await sendOTP(email, otp, "signup");

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("OTP ERROR:", error);
    // Never leak internal error details to the client
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ==========================
// Verify Signup OTP
// ==========================

export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpData = await OTP.findOne({ email, purpose: "signup" });
    const error = await validateOTP(otpData, otp);
    if (error) {
      return res.status(400).json({ message: error });
    }

    // Create actual user
    await User.create({
      name: otpData.name,
      email: otpData.email,
      password: otpData.password,
    });

    // Single-use: expire the OTP instantly once used
    await OTP.deleteMany({ email, purpose: "signup" });

    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

// ==========================
// Resend OTP
// ==========================

const handleResend = async (req, res, purpose, notFoundMessage) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otpData = await OTP.findOne({ email, purpose });

    if (!otpData) {
      return res.status(404).json({ message: notFoundMessage });
    }

    // Check lock
    if (otpData.lockedUntil && new Date() < otpData.lockedUntil) {
      return res.status(400).json({
        message: "Too many attempts. Try after 30 minutes.",
      });
    }

    // Check cooldown
    if (otpData.nextResendTime && new Date() < otpData.nextResendTime) {
      const seconds = Math.ceil((otpData.nextResendTime - new Date()) / 1000);
      return res.status(400).json({ message: `Wait ${seconds}s` });
    }

    const otp = generateOTP();
    const newCount = otpData.resendCount + 1;

    // Lock after 5 resends
    let lockedUntil = null;
    if (newCount >= 5) {
      lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    // Dynamic cooldown
    const cooldown = newCount * 30;

    // A fresh code means fresh verification attempts
    otpData.otp = await bcrypt.hash(otp, 10);
    otpData.attempts = 0;
    otpData.verified = false;
    otpData.expiresAt = new Date(Date.now() + OTP_TTL_MS);
    otpData.resendCount = newCount;
    otpData.nextResendTime = new Date(Date.now() + cooldown * 1000);
    otpData.lockedUntil = lockedUntil;
    await otpData.save();

    await sendOTP(email, otp, purpose);

    return res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// ==========================
// Resend OTP (signup)
// ==========================
export const resendOTP = (req, res) =>
  handleResend(req, res, "signup", "Signup session not found. Please start again.");

// ==========================
// Resend OTP (forgot password)
// ==========================
export const resendForgotOTP = (req, res) =>
  handleResend(
    req,
    res,
    "forgotPassword",
    "No password-reset request found. Please start again."
  );

// ==========================
// Forgot Password: Send OTP
// ==========================

export const sendForgotOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = await createOTPDoc({
      email,
      name: user.name,
      password: user.password,
      purpose: "forgotPassword",
    });

    await sendOTP(email, otp, "forgotPassword");

    return res.json({ message: "OTP sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed sending OTP" });
  }
};

// ==========================
// Forgot Password: Verify OTP
// ==========================

export const verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpData = await OTP.findOne({ email, purpose: "forgotPassword" });
    const error = await validateOTP(otpData, otp);
    if (error) {
      return res.status(400).json({ message: error });
    }

    // Mark the code as consumed: it can never be verified again.
    // resetPassword checks this flag, so a password reset is impossible
    // without proving ownership of the email first.
    otpData.verified = true;
    otpData.otp = await bcrypt.hash(generateOTP(), 10); // invalidate the code itself
    await otpData.save();

    return res.json({ message: "OTP verified. You can now reset your password." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

// ==========================
// Forgot Password: Reset Password
// ==========================

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // The OTP must have been verified first — without this check, anyone
    // could reset anyone else's password with just their email address.
    const otpData = await OTP.findOne({ email, purpose: "forgotPassword", verified: true });
    if (!otpData) {
      return res.status(400).json({ message: "OTP verification required before resetting password" });
    }
    if (isExpired(otpData)) {
      await OTP.deleteOne({ _id: otpData._id });
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    // Invalidate all existing sessions after a password change
    user.refreshToken = null;
    await user.save();

    // Single-use: expire the OTP instantly once used
    await OTP.deleteMany({ email, purpose: "forgotPassword" });

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed updating password" });
  }
};
