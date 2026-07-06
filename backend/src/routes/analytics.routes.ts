import { Router } from 'express';
import { getUserAnalytics, getGlobalAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/global', getGlobalAnalytics);
router.get('/user', authenticate, getUserAnalytics);

export default router;
