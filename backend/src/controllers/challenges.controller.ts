// Physics challenges controller – stubbed (not used in fitness app)
import { Request, Response } from 'express';
export async function getChallenges(req: Request, res: Response) { res.json([]); }
export async function getChallengeById(req: Request, res: Response) { res.status(404).json({ message: 'Not found' }); }
export async function submitScore(req: any, res: Response) { res.status(501).json({ message: 'Not implemented' }); }
export async function getLeaderboard(req: Request, res: Response) { res.json([]); }
