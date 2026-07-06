// Physics experiments controller – stubbed (not used in fitness app)
import { Request, Response } from 'express';
export async function getExperiments(req: any, res: Response) { res.json([]); }
export async function createExperiment(req: any, res: Response) { res.status(501).json({ message: 'Not implemented' }); }
export async function getExperimentById(req: any, res: Response) { res.status(404).json({ message: 'Not found' }); }
export async function updateExperiment(req: any, res: Response) { res.status(501).json({ message: 'Not implemented' }); }
export async function deleteExperiment(req: any, res: Response) { res.status(501).json({ message: 'Not implemented' }); }
