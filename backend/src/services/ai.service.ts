import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

if (!process.env.OPENROUTER_API_KEY) {
  console.warn('WARNING: OPENROUTER_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy_key',
});

/**
 * Free model IDs from OpenRouter (ordered best → fastest fallback).
 * If one fails (429/503/empty), the next is tried automatically.
 */
const FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',        // Llama 3.3 70B — very reliable
  'google/gemma-3-27b-it:free',                     // Gemma 3 27B — good JSON
  'qwen/qwen3-coder:free',                          // Qwen3 coder — good structured output
  'mistralai/mistral-7b-instruct:free',             // Mistral 7B — fast fallback
  'microsoft/phi-3-mini-128k-instruct:free',        // Phi-3 Mini — lightweight fallback
  'nvidia/nemotron-3-super-120b-a12b:free',         // Nvidia 120B
  'nousresearch/hermes-3-llama-3.1-405b:free',     // Large model last resort
];

async function chatWithFallback(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
): Promise<string> {
  let lastError: any;
  for (const model of FREE_MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);
      const completion = await openai.chat.completions.create({ model, messages });
      // Some models return malformed responses with no choices — treat as soft failure
      const content = completion.choices?.[0]?.message?.content;
      if (content) {
        console.log(`[AI] Success with model: ${model}`);
        return content;
      }
      console.warn(`[AI] Model ${model} returned empty content, trying next...`);
      lastError = new Error(`Model ${model} returned empty content`);
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      if (status === 400 || status === 429 || status === 503 || status === 529) {
        console.warn(`[AI] Model ${model} failed (${status}), trying next...`);
        lastError = err;
        continue;
      }
      // For other errors, also continue to next model rather than crash
      console.warn(`[AI] Model ${model} threw error: ${err?.message}, trying next...`);
      lastError = err;
    }
  }
  throw lastError || new Error('All AI models failed. Please try again in a minute.');
}

// Robustly extract the first valid JSON object from any model response
function extractJSON(raw: string): any {
  // 1. Strip <think>...</think> blocks (used by reasoning models like Qwen, DeepSeek)
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. Strip markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/im, '').trim();

  // 3. Try direct parse
  try { return JSON.parse(cleaned); } catch {}

  // 4. Find the outermost JSON object in the text
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(cleaned.slice(start, end + 1)); } catch {}
  }

  // 5. Regex fallback — find any {...} block
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }

  console.error('[AI] Raw response that failed JSON extraction:', raw.slice(0, 500));
  throw new Error('Could not extract valid JSON from AI response');
}

export const aiService = {
  async generatePersonalizedPlan(userId: string) {
    const profile = await prisma.healthProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('User profile not found');

    const prompt = `You are an expert fitness coach and nutritionist specializing in authentic Indian diets, specifically from the state of Andhra Pradesh.
Create a 7-day workout plan, a 7-day Indian diet plan, and a detailed analysis for the following user:

- Goal: ${profile.goal || 'General Fitness'}
- Diet Preference: ${profile.dietPreference || 'Vegetarian'}
- Available Equipment: ${profile.equipment || 'Home Bodyweight'}
- Weight: ${profile.weightKg || 'Unknown'} kg
- Height: ${profile.heightCm || 'Unknown'} cm
- Age: ${profile.age || 'Unknown'}
- Gender: ${profile.gender || 'Unknown'}

CRITICAL NUTRITION RULES:
1. The diet MUST be strictly an authentic Indian diet specifically tailored to Andhra Pradesh.
2. If Diet Preference is "Non-Vegetarian", include BOTH Andhra vegetarian AND non-vegetarian meals (Kodi Pulao, Natukodi Kura, Royyala Iguru, etc.).

You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code fences. Just the JSON.
Format:
{
  "detailedAnalysis": "string with BMR, goal reasoning, diet rationale",
  "workoutPlan": [
    { "day": "Monday", "focus": "Upper Body", "exercises": ["Pushups 3x10", "Pike Pushups 3x8"] }
  ],
  "dietPlan": [
    { "day": "Monday", "calories": 2000, "protein": "100g", "carbs": "200g", "fats": "50g", "breakfast": "Upma with peanuts", "lunch": "Rice with Pappu Charu", "dinner": "Roti with Palak Dal", "snack": "Roasted chana" }
  ]
}`;

    const rawResult = await chatWithFallback([{ role: 'user', content: prompt }]);
    const planData = extractJSON(rawResult);

    // Deactivate old plans
    await prisma.aiPlan.updateMany({ where: { userId, active: true }, data: { active: false } });
    await prisma.aiPlan.create({
      data: { userId, planType: 'FULL_PLAN', content: JSON.stringify(planData) }
    });

    return planData;
  },

  async chatWithUser(userId: string, message: string) {
    const profile = await prisma.healthProfile.findUnique({ where: { userId } });
    const currentPlan = await prisma.aiPlan.findFirst({
      where: { userId, active: true },
      orderBy: { createdAt: 'desc' }
    });
    const progressLogs = await prisma.progressLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    let context = `User Profile: Goal: ${profile?.goal}, Diet: ${profile?.dietPreference}, Weight: ${profile?.weightKg}kg. Current Day of Week: ${todayStr}.`;
    if (progressLogs.length > 0) {
      context += ` Recent Progress: Weight changed to ${progressLogs[0].weightKg}kg. Feedback: ${progressLogs[0].feedback}.`;
    }
    if (currentPlan) {
      context += ` Current Active Plan JSON: ${currentPlan.content}.`;
    }

    const prompt = `You are an interactive AI Fitness Coach specializing in authentic Indian diets (specifically Andhra Pradesh).
Context about the user:
${context}

The user says: "${message}"

You MUST respond with ONLY a raw JSON object. No markdown, no code fences, no explanation before or after.

If the user is asking to CHANGE their diet or workout:
{ "response": "conversational acknowledgement", "updatedPlan": { "detailedAnalysis": "...", "workoutPlan": [...], "dietPlan": [{"day":"Monday","calories":2000,"protein":"100g","carbs":"200g","fats":"50g","breakfast":"...","lunch":"...","dinner":"...","snack":"..."}] } }

If the user is just asking a question:
{ "response": "your answer", "updatedPlan": null }

CRITICAL: Andhra Pradesh authentic Indian diet only. Non-veg users get both veg and non-veg Andhra dishes.`;

    const rawResult2 = await chatWithFallback([{ role: 'user', content: prompt }]);
    const result = extractJSON(rawResult2);

    // Save conversation
    await prisma.aiMessage.create({ data: { userId, role: 'user', content: message } });
    await prisma.aiMessage.create({ data: { userId, role: 'assistant', content: result.response || '' } });

    // Update active plan if AI returned a new one
    if (result.updatedPlan) {
      await prisma.aiPlan.updateMany({ where: { userId, active: true }, data: { active: false } });
      await prisma.aiPlan.create({ data: { userId, planType: 'FULL_PLAN', content: JSON.stringify(result.updatedPlan) } });
    }

    return result;
  }
};

// Named exports expected by physics controllers (stubs)
export async function streamChat(_messages: any[], res: any) {
  res.status(501).json({ message: 'Streaming not implemented' });
}
export async function getSuggestions(_history: string[]): Promise<string> { return '[]'; }
export async function explainResult(_context: string): Promise<string> { return 'Explanation unavailable.'; }
