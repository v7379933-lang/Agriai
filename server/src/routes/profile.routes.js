import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validate.js';
import { ProfileUpdateSchema } from '../validators/profile.schema.js';

const router = Router();

router.get('/', requireAuth, ProfileController.getProfile);
router.put('/', requireAuth, validateRequest(ProfileUpdateSchema), ProfileController.updateProfile);

export default router;

