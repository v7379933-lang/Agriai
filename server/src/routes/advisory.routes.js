import { Router } from 'express';
import { AdvisoryController } from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validate.js';
import { CropRecommendationInputSchema } from '../validators/cropRecommendation.schema.js';
import { FertilizerInputSchema } from '../validators/fertilizer.schema.js';
import { IrrigationInputSchema } from '../validators/irrigation.schema.js';

const router = Router();

router.post('/ai/crop-recommendation', requireAuth, validateRequest(CropRecommendationInputSchema), AdvisoryController.generateCropRecommendation);
router.post('/ai/fertilizer-advisory', requireAuth, validateRequest(FertilizerInputSchema), AdvisoryController.generateFertilizerAdvisory);
router.post('/ai/irrigation-advisory', requireAuth, validateRequest(IrrigationInputSchema), AdvisoryController.generateIrrigationAdvisory);

router.get('/advisories', requireAuth, AdvisoryController.getAdvisories);
router.get('/advisories/:id', requireAuth, AdvisoryController.getAdvisoryById);
router.delete('/advisories/:id', requireAuth, AdvisoryController.deleteAdvisory);

export default router;

