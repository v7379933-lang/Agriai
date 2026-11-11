import { Router } from 'express';
import multer from 'multer';
import { DiseaseController } from '../controllers/disease.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Supported formats: JPEG, PNG, WebP.'));
    }
  }
});

const router = Router();

router.post('/ai/disease-detection', requireAuth, upload.single('image'), DiseaseController.scanDisease);
router.get('/ai/disease-detection/:id', requireAuth, DiseaseController.getDiseaseReportById);

export default router;

