import { validationResult } from 'express-validator';
import xss from 'xss';
import { AppError } from './errorHandler.js';

const cleanValue = (value) => {
  if (typeof value === 'string') return xss(value.trim());
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cleanValue(val)]));
  }
  return value;
};

export const sanitizeBody = (req, _res, next) => {
  req.body = cleanValue(req.body || {});
  next();
};

export const validate = (rules) => [
  ...rules,
  (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map((error) => error.msg).join(', '), 422));
    }
    next();
  }
];
