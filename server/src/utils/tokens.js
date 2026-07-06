import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, env.accessSecret, {
    expiresIn: env.accessExpires
  });

export const createRefreshToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, type: 'refresh' }, env.refreshSecret, {
    expiresIn: env.refreshExpires
  });

export const createPublicToken = () => crypto.randomBytes(32).toString('hex');
