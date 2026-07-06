import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

export const protect = async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Authentication required', 401));

  try {
    const decoded = jwt.verify(token, env.accessSecret);
    const user = await User.findById(decoded.id).select('+password');
    if (!user) return next(new AppError('User no longer exists', 401));
    req.user = user;
    next();
  } catch (_error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};
