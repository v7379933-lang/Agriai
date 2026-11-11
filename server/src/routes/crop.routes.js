import { Router } from 'express';
import { CropController } from '../controllers/crop.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/crops', requireAuth, CropController.getCrops);
router.get('/crops/:id', requireAuth, CropController.getCropById);
router.get('/farmer-crops', requireAuth, CropController.getFarmerCrops);
router.post('/farmer-crops', requireAuth, CropController.registerFarmerCrop);
router.put('/farmer-crops/:id/stage', requireAuth, CropController.updateGrowthStage);

export default router;

