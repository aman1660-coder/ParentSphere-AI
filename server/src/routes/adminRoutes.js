import express from 'express';
import { body } from 'express-validator';
import { analytics, deleteUser, listUsers, updateUserRole } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/analytics', analytics);
router.get('/users', listUsers);
router.patch('/users/:id/role', validate([body('role').isIn(['parent', 'counsellor', 'admin'])]), updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
