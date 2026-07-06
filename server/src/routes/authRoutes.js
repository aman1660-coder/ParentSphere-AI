import express from 'express';
import { body } from 'express-validator';
import {
  forgotPassword,
  login,
  loginRules,
  logout,
  me,
  refresh,
  register,
  registerRules,
  resetPassword,
  verifyEmail
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.post('/refresh', refresh);
router.post('/forgot-password', validate([body('email').isEmail().withMessage('Valid email is required')]), forgotPassword);
router.post('/reset-password/:token', validate([body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')]), resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', protect, me);
router.post('/logout', protect, logout);

export default router;
