import { generatePRD } from '../lib/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error('[generate-prd] OPENROUTER_API_KEY is not set');
    return res.status(500).json({
      error: 'Server misconfigured: OPENROUTER_API_KEY is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { idea } = body || {};

  if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a product idea (at least 10 characters)' });
  }

  if (idea.trim().length > 2000) {
    return res.status(400).json({ error: 'Product idea is too long. Please keep it under 2000 characters.' });
  }

  const startedAt = Date.now();
  console.log(`[generate-prd] Starting generation for: "${idea.slice(0, 60)}..."`);

  try {
    const prd = await generatePRD(idea.trim());
    console.log(`[generate-prd] Done in ${Date.now() - startedAt}ms — title: "${prd.title}"`);
    return res.status(200).json({ success: true, prd });
  } catch (error) {
    console.error(`[generate-prd] Failed after ${Date.now() - startedAt}ms:`, error.message, error.stack);

    if (error.status === 401) {
      return res.status(500).json({ error: 'Invalid OPENROUTER_API_KEY. Verify it in Vercel env vars.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached on the free tier. Wait 60s, or try a different free model in OPENROUTER_MODEL.' });
    }
    if (error.status === 402) {
      return res.status(402).json({
        error: 'Credit balance issue on OpenRouter. Free tier allows 50 req/day — try again tomorrow or add $10 lifetime credits at openrouter.ai for 1000 req/day.',
      });
    }
    if (error instanceof SyntaxError) {
      return res.status(502).json({ error: 'AI returned malformed JSON. Please try again.' });
    }

    return res.status(500).json({
      error: 'Failed to generate PRD: ' + (error.message || 'Unknown error'),
    });
  }
}

export const config = {
  maxDuration: 60,
};
