import { Router } from 'express';
import { getRecordings, uploadRecording, getRecordingById } from '../controllers/recordings.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getRecordings);
router.post('/upload', uploadRecording);
router.get('/:id', getRecordingById);

export default router;
