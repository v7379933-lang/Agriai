import { Router } from 'express';
import { GuideController } from '../controllers/guide.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, GuideController.getGuides);
router.get('/:slug', requireAuth, GuideController.getGuideBySlug);

export default router;

