/**
 * fitness.routes.ts
 * Main routes consumed by the frontend:
 *   POST /api/profile   – save health profile & generate AI plan
 *   GET  /api/plan      – get the active plan for the session user
 *   GET  /api/chat      – get conversation history
 *   POST /api/chat      – send a message to the AI coach
 *   POST /api/progress  – log weight + feedback & regenerate plan
 *
 * NOTE: For simplicity the routes use a "guest" user stored in a well-known
 * session cookie key (guestUserId). A production app should use JWT auth,
 * but this gets the frontend working end-to-end without any login.
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/ai.service';

const router = Router();
const prisma = new PrismaClient();

const GUEST_EMAIL = 'guest@fitness.app';
const GUEST_NAME  = 'Guest';
const GUEST_PASS  = 'guest_pass_unused'; // never used for auth here

async function getOrCreateGuestUser() {
  let user = await prisma.user.findUnique({ where: { email: GUEST_EMAIL } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: GUEST_EMAIL, name: GUEST_NAME, passwordHash: GUEST_PASS }
    });
  }
  return user;
}

// ──────────────────────────────────────────────────────────
// POST /api/profile  – save profile & generate plan
// ──────────────────────────────────────────────────────────
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { goal, dietPreference, equipment, weightKg, heightCm, age, gender } = req.body;
    const user = await getOrCreateGuestUser();

    // Upsert health profile
    await prisma.healthProfile.upsert({
      where: { userId: user.id },
      update: {
        goal,
        dietPreference,
        equipment,
        weightKg: parseFloat(weightKg) || null,
        heightCm: parseFloat(heightCm) || null,
        age: parseInt(age) || null,
        gender,
      },
      create: {
        userId: user.id,
        goal,
        dietPreference,
        equipment,
        weightKg: parseFloat(weightKg) || null,
        heightCm: parseFloat(heightCm) || null,
        age: parseInt(age) || null,
        gender,
      }
    });

    // Generate AI plan (can take a few seconds)
    const planData = await aiService.generatePersonalizedPlan(user.id);
    res.json({ success: true, plan: planData });
  } catch (error: any) {
    console.error('POST /api/profile error:', error);
    const isRateLimit = error?.status === 429 || String(error).includes('429') || String(error).includes('rate-limited');
    const friendlyMsg = isRateLimit
      ? 'All AI models are currently busy. Please wait 30 seconds and try again.'
      : String(error);
    res.status(500).json({ success: false, error: friendlyMsg });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/plan  – return the active plan
// ──────────────────────────────────────────────────────────
router.get('/plan', async (req: Request, res: Response) => {
  try {
    const user = await getOrCreateGuestUser();
    const plan = await prisma.aiPlan.findFirst({
      where: { userId: user.id, active: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!plan) return res.json({ success: false, plan: null });

    res.json({ success: true, plan: JSON.parse(plan.content) });
  } catch (error) {
    console.error('GET /api/plan error:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/chat  – load conversation history
// ──────────────────────────────────────────────────────────
router.get('/chat', async (req: Request, res: Response) => {
  try {
    const user = await getOrCreateGuestUser();
    const messages = await prisma.aiMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
      take: 50
    });
    res.json({ success: true, messages });
  } catch (error) {
    console.error('GET /api/chat error:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/chat  – send a message to the AI coach
// ──────────────────────────────────────────────────────────
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'message is required' });

    const user = await getOrCreateGuestUser();
    const result = await aiService.chatWithUser(user.id, message);

    res.json({
      success: true,
      response: result.response,
      planUpdated: !!result.updatedPlan
    });
  } catch (error) {
    console.error('POST /api/chat error:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/progress  – log progress & regenerate plan
// ──────────────────────────────────────────────────────────
router.post('/progress', async (req: Request, res: Response) => {
  try {
    const { weightKg, feedback } = req.body;
    const user = await getOrCreateGuestUser();

    // Save the progress log
    await prisma.progressLog.create({
      data: {
        userId: user.id,
        weightKg: parseFloat(weightKg),
        feedback
      }
    });

    // Update weight in health profile
    await prisma.healthProfile.updateMany({
      where: { userId: user.id },
      data: { weightKg: parseFloat(weightKg) }
    });

    // Ask AI to factor in the progress and regenerate the plan
    const progressContext = `The user has reported new weight: ${weightKg}kg. Their feedback on the last week's protocol: "${feedback}". Please update the plan accordingly.`;
    await aiService.chatWithUser(user.id, progressContext);

    res.json({ success: true });
  } catch (error) {
    console.error('POST /api/progress error:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;
