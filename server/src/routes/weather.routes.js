import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/current', requireAuth, WeatherController.getCurrent);
router.get('/forecast', requireAuth, WeatherController.getForecast);
router.get('/advisory', requireAuth, WeatherController.getAgriculturalAdvisory);

export default router;

