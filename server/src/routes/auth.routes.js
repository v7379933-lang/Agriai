import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/me', requireAuth, AuthController.getMe);
router.get('/google/url', AuthController.googleAuthUrl);
router.post('/refresh', AuthController.refreshToken);

export default router;
