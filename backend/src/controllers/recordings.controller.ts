// Physics recordings controller – stubbed (not used in fitness app)
import { Request, Response } from 'express';
import { generateUploadUrl } from '../services/storage.service';
import crypto from 'crypto';

export async function getRecordings(req: any, res: Response) { res.json([]); }
export async function uploadRecording(req: any, res: Response) {
  try {
    const { contentType } = req.body;
    const filename = `${crypto.randomUUID()}-${Date.now()}.webm`;
    const uploadUrl = await generateUploadUrl(filename, contentType);
    res.json({ uploadUrl, filename });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
export async function getRecordingById(req: any, res: Response) { res.status(404).json({ message: 'Not found' }); }
