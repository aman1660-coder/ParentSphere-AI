import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emailTemplates, sendEmail } from '../utils/email.js';
import { createAccessToken, createPublicToken, createRefreshToken, hashToken } from '../utils/tokens.js';

export const registerRules = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isLength({ min: 6 }).withMessage('Phone looks too short'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['parent', 'counsellor']).withMessage('Invalid role')
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const issueTokens = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshTokens.push({ token: hashToken(refreshToken) });
  if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new AppError('Email is already registered', 409);

  const verificationToken = createPublicToken();
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: req.body.role || 'parent',
    emailVerificationToken: hashToken(verificationToken)
  });

  const verifyLink = `${env.clientUrl}/verify-email/${verificationToken}`;
  const template = emailTemplates.welcome(user.name, verifyLink);
  await sendEmail({ to: user.email, ...template });

  const tokens = await issueTokens(user);
  res.status(201).json({ success: true, user: user.safeProfile(), ...tokens });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  const tokens = await issueTokens(user);
  res.json({ success: true, user: user.safeProfile(), ...tokens });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token is required', 400);

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.refreshSecret);
  } catch (_error) {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(decoded.id).select('+password');
  if (!user) throw new AppError('User not found', 401);

  const hashed = hashToken(refreshToken);
  const hasToken = user.refreshTokens.some((item) => item.token === hashed);
  if (!hasToken) throw new AppError('Refresh token has been revoked', 401);

  user.refreshTokens = user.refreshTokens.filter((item) => item.token !== hashed);
  const tokens = await issueTokens(user);
  res.json({ success: true, user: user.safeProfile(), ...tokens });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    req.user.refreshTokens = req.user.refreshTokens.filter((item) => item.token !== hashToken(refreshToken));
    await req.user.save({ validateBeforeSave: false });
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedBooks');
  res.json({ success: true, user: user.safeProfile() });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+passwordResetToken +passwordResetExpires');
  if (!user) {
    return res.json({ success: true, message: 'If the email exists, reset instructions have been sent' });
  }

  const token = createPublicToken();
  user.passwordResetToken = hashToken(token);
  user.passwordResetExpires = Date.now() + 1000 * 60 * 30;
  await user.save({ validateBeforeSave: false });

  const resetLink = `${env.clientUrl}/reset-password/${token}`;
  const template = emailTemplates.reset(user.name, resetLink);
  await sendEmail({ to: user.email, ...template });
  res.json({ success: true, message: 'Password reset instructions sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    passwordResetToken: hashToken(req.params.token),
    passwordResetExpires: { $gt: Date.now() }
  }).select('+passwordResetToken +passwordResetExpires +password');

  if (!user) throw new AppError('Reset link is invalid or expired', 400);
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();
  const tokens = await issueTokens(user);
  res.json({ success: true, user: user.safeProfile(), ...tokens });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ emailVerificationToken: hashToken(req.params.token) }).select(
    '+emailVerificationToken'
  );
  if (!user) throw new AppError('Verification link is invalid', 400);
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, message: 'Email verified successfully' });
});
