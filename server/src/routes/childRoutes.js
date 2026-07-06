import express from 'express';
import { body } from 'express-validator';
import {
  addGrowth,
  childRules,
  createChild,
  deleteChild,
  getGrowthRecommendations,
  listChildren,
  updateChild
} from '../controllers/childController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();
const updateChildRules = [
  body('name').optional().isLength({ min: 2 }).withMessage('Child name is required'),
  body('age').optional().isFloat({ min: 0, max: 18 }).withMessage('Age must be between 0 and 18'),
  body('height').optional().isFloat({ min: 1 }).withMessage('Height is required'),
  body('weight').optional().isFloat({ min: 1 }).withMessage('Weight is required'),
  body('schoolGrade').optional().notEmpty().withMessage('School grade is required')
];

router.use(protect, authorize('parent', 'admin'));
router.route('/').get(listChildren).post(validate(childRules), createChild);
router.route('/:id').put(validate(updateChildRules), updateChild).delete(deleteChild);
router.post(
  '/:id/growth',
  validate([
    body('height').isFloat({ min: 1 }).withMessage('Height is required'),
    body('weight').isFloat({ min: 1 }).withMessage('Weight is required')
  ]),
  addGrowth
);
router.get('/:id/recommendations', getGrowthRecommendations);

export default router;
