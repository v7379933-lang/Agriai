import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/chat', requireAuth, ChatController.sendMessage);
router.get('/chat/conversations', requireAuth, ChatController.getConversations);
router.get('/chat/conversations/:id', requireAuth, ChatController.getConversationById);
router.delete('/chat/conversations/:id', requireAuth, ChatController.deleteConversation);

export default router;

