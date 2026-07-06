import { Router } from 'express';
import { chat, suggestions, explain } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/chat', chat);
router.get('/suggestions', suggestions);
router.get('/explain/:id', explain);

export default router;
