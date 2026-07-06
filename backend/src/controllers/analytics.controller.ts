import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserAnalytics(req: any, res: Response) {
  try {
    const planCount = await prisma.aiPlan.count({ where: { userId: req.user?.id } });
    const messageCount = await prisma.aiMessage.count({ where: { userId: req.user?.id } });
    const progressCount = await prisma.progressLog.count({ where: { userId: req.user?.id } });
    res.json({ planCount, messageCount, progressCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getGlobalAnalytics(req: Request, res: Response) {
  try {
    const userCount = await prisma.user.count();
    const planCount = await prisma.aiPlan.count();
    const messageCount = await prisma.aiMessage.count();
    res.json({ userCount, planCount, messageCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
