import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', requireAuth, requireAdmin, AdminController.getDashboardMetrics);
router.get('/sources', requireAuth, requireAdmin, AdminController.getSources);

export default router;

