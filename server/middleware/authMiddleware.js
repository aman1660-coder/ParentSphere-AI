import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Counsellor from '../models/Counsellor.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user is parent/admin
      let user = await User.findById(decoded.userId).select('-password');
      
      // If not in User, check Counsellor
      if (!user) {
        user = await Counsellor.findById(decoded.userId).select('-password');
      }

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as an admin'));
  }
};

// Counsellor middleware
export const counsellor = (req, res, next) => {
  if (req.user && req.user.role === 'counsellor') {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as a counsellor'));
  }
};
