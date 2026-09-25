import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Access and refresh tokens must use different secrets. Falls back to
// JWT_SECRET so existing deployments keep working until JWT_REFRESH_SECRET
// is set (see .env.example).
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

// NOTE: handleSignup was removed. The direct signup endpoint created accounts
// without email verification, bypassing the OTP flow entirely. Signups go
// through sendSignupOTP + verifySignupOTP in otp.controller.js.

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    // Generic message for both cases so attackers can't enumerate
    // which email addresses have accounts.
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    const accessToken = jwt.sign({ userId: user._id }, ACCESS_SECRET, {
      expiresIn: '15m',
    });

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: 'User Logged In',
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.log('LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Something went wrong while logging in' });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: 'invalid refresh token',
      });
    }
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
      },
      ACCESS_SECRET,
      {
        expiresIn: '15m',
      }
    );
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};

export const handleLogout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      message: 'No or invalid Token',
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User Not found',
      });
    }
    user.refreshToken = null;
    await user.save();
    return res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log('GET PROFILE ERROR:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching profile' });
  }
};
