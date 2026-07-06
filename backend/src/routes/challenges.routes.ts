import { Router } from 'express';
import { getChallenges, getChallengeById, submitScore as submitChallengeScore, getLeaderboard } from '../controllers/challenges.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/leaderboard', getLeaderboard); // Global leaderboard
router.get('/', getChallenges);
router.get('/:id', getChallengeById);

router.post('/submit', authenticate, submitChallengeScore);

export default router;
