import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { streamChat, getSuggestions, explainResult } from '../services/ai.service';

const prisma = new PrismaClient();

export async function chat(req: any, res: Response) {
  try {
    const { messages } = req.body;
    await streamChat(messages || [], res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function suggestions(req: any, res: Response) {
  try {
    const result = await getSuggestions([]);
    res.json(JSON.parse(result || '[]'));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function explain(req: any, res: Response) {
  try {
    const explanation = await explainResult(req.body?.context || '');
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
