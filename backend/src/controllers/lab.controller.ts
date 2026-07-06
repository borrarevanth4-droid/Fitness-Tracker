// Physics lab controller – stubbed (not used in fitness app)
import { Request, Response } from 'express';
export async function getScenes(req: Request, res: Response) { res.json([]); }
export async function addObject(req: any, res: Response) { res.status(501).json({ message: 'Not implemented' }); }
export async function getObject(req: any, res: Response) { res.status(404).json({ message: 'Not found' }); }
export async function deleteObject(req: any, res: Response) { res.status(501).json({ message: 'Not implemented' }); }
