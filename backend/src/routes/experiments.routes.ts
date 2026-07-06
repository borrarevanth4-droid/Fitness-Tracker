import { Router } from 'express';
import { getExperiments, createExperiment, getExperimentById, updateExperiment, deleteExperiment } from '../controllers/experiments.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getExperiments);
router.post('/', createExperiment);
router.get('/:id', getExperimentById);
router.put('/:id', updateExperiment);
router.delete('/:id', deleteExperiment);

export default router;
