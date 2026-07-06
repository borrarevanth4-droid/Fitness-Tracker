import { Router } from 'express';
import { getScenes, addObject as createLabObject, deleteObject as deleteLabObject } from '../controllers/lab.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/scenes', getScenes);
router.post('/objects', createLabObject);
router.delete('/objects/:id', deleteLabObject);

export default router;
